"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getClientsList, getCurrentStaff, searchClients } from "@/lib/staff/queries"
import type { ClientListPage, ClientListSort, ClientListStatusFilter, ClientSearchResult } from "@/lib/staff/types"

export interface FormActionState {
  error: string | null;
}

export async function signIn(_prevState: FormActionState | null, formData: FormData): Promise<FormActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/staff");
}

// Self-signup is invite-only: a new account only ever gets a row in
// public.staff (and therefore any RLS access at all) via redeem_staff_invite,
// which validates the code server-side. See supabase/migrations/0003.
export async function signUp(_prevState: FormActionState | null, formData: FormData): Promise<FormActionState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const code = String(formData.get("code") || "").trim();

  if (!name || !email || !password || !code) {
    return { error: "All fields, including the invite code, are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = createClient();
  const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

  if (signUpError) {
    return { error: signUpError.message };
  }

  // Most Supabase projects require email confirmation before a session
  // exists, but redeeming the invite needs an authenticated request (the
  // function reads auth.uid()). Rather than build a second confirm-then-claim
  // flow, this invite path requires confirmations off for the project — the
  // account still exists in auth.users either way, so an owner can always
  // finish provisioning it manually (supabase/README.md) if this fires.
  if (!data.session) {
    return {
      error:
        "Account created, but needs email confirmation before it can be provisioned. Ask an owner to disable email confirmations for this project, or add your staff row manually.",
    };
  }

  const { error: redeemError } = await supabase.rpc("redeem_staff_invite", {
    p_code: code,
    p_name: name,
  });

  if (redeemError) {
    return { error: redeemError.message };
  }

  redirect("/staff");
}

export async function createStaffInvite(role: "staff" | "owner"): Promise<{ error?: string; code?: string }> {
  const staff = await getCurrentStaff();
  if (!staff || staff.role !== "owner") return { error: "Owners only." };

  const supabase = createClient();
  const { data, error } = await supabase
    .from("staff_invites")
    .insert({ role, created_by: staff.id })
    .select("code")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/staff/invites");
  return { code: data.code as string };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/staff/login");
}

export async function searchClientsAction(query: string): Promise<ClientSearchResult[]> {
  return searchClients(query);
}

export async function getClientsListAction(
  sort: ClientListSort,
  page: number,
  status: ClientListStatusFilter = "all"
): Promise<ClientListPage> {
  return getClientsList({ sort, page, status });
}

export async function setPrescriptionRevoked(prescriptionId: string, revoked: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("prescriptions")
    .update({ revoked })
    .eq("id", prescriptionId);

  if (error) throw new Error(error.message);

  revalidatePath("/staff/clients/[clientId]", "page");
}

export interface CreateClientInput {
  name: string;
  phone: string;
  lineId: string;
  idNumber: string;
  firstVisitDate: string;
  pt33Number: string;
  issueDate: string;
  doctor: string;
}

// New client + their first PT.33 in one call — create_client_with_prescription
// (supabase/migrations/0003) inserts both in a single transaction so a client
// is never left on file without a prescription if the second insert fails
// (e.g. a duplicate pt33_number).
export async function createClientWithPrescription(input: CreateClientInput): Promise<{ error?: string; clientId?: string }> {
  const staff = await getCurrentStaff();
  if (!staff) return { error: "Not signed in." };

  const name = input.name.trim();
  const pt33Number = input.pt33Number.trim();
  if (!name) return { error: "Client name is required." };
  if (!pt33Number) return { error: "PT.33 number is required." };
  if (!input.issueDate) return { error: "Issue date is required." };

  const supabase = createClient();
  const { data, error } = await supabase.rpc("create_client_with_prescription", {
    p_name: name,
    p_phone: input.phone.trim(),
    p_line_id: input.lineId.trim(),
    p_id_number: input.idNumber.trim(),
    p_first_visit_date: input.firstVisitDate || null,
    p_pt33_number: pt33Number,
    p_issue_date: input.issueDate,
    p_doctor: input.doctor.trim(),
  });

  if (error) {
    if (error.message.includes("prescriptions_pt33_number_key")) {
      return { error: "That PT.33 number is already on file for another client." };
    }
    return { error: error.message };
  }

  revalidatePath("/staff");
  return { clientId: data as string };
}

export interface CreatePrescriptionInput {
  clientId: string;
  pt33Number: string;
  issueDate: string;
  doctor: string;
}

// Adds a renewal PT.33 to an existing client — used from their card once the
// current prescription has expired (or as a second cert on file).
export async function createPrescription(input: CreatePrescriptionInput): Promise<{ error?: string }> {
  const staff = await getCurrentStaff();
  if (!staff) return { error: "Not signed in." };

  const pt33Number = input.pt33Number.trim();
  if (!pt33Number) return { error: "PT.33 number is required." };
  if (!input.issueDate) return { error: "Issue date is required." };

  const supabase = createClient();
  const { error } = await supabase.from("prescriptions").insert({
    client_id: input.clientId,
    pt33_number: pt33Number,
    issue_date: input.issueDate,
    doctor: input.doctor.trim() || null,
  });

  if (error) {
    if (error.message.includes("prescriptions_pt33_number_key")) {
      return { error: "That PT.33 number is already on file for another client." };
    }
    return { error: error.message };
  }

  revalidatePath(`/staff/clients/${input.clientId}`);
  return {};
}

export interface CreatePurchaseInput {
  clientId: string;
  prescriptionId: string;
  product: string;
  quantity: number;
  price: number;
}

export async function createPurchase(input: CreatePurchaseInput): Promise<{ error?: string; success?: true }> {
  const staff = await getCurrentStaff();
  if (!staff) return { error: "Not signed in." };

  const product = input.product.trim();
  if (!product) return { error: "Product is required." };
  if (!(input.quantity > 0)) return { error: "Quantity must be greater than 0." };
  if (!(input.price >= 0)) return { error: "Price cannot be negative." };

  const supabase = createClient();

  // Re-check status server-side right before writing — the card the staff
  // member is looking at can be stale (another till, another tab).
  const { data: rx } = await supabase
    .from("prescriptions_view")
    .select("status")
    .eq("id", input.prescriptionId)
    .single();

  if (!rx || rx.status !== "active") {
    return { error: "This PT.33 is not active. Sale blocked." };
  }

  const { error } = await supabase.from("purchases").insert({
    client_id: input.clientId,
    prescription_id: input.prescriptionId,
    product,
    quantity: input.quantity,
    price: input.price,
    staff_id: staff.id,
  });

  if (error) return { error: error.message };

  revalidatePath(`/staff/clients/${input.clientId}`);
  return { success: true };
}
