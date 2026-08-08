"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getClientsList, getCurrentStaff, searchClients } from "@/lib/staff/queries"
import type { ClientListPage, ClientListSort, ClientSearchResult } from "@/lib/staff/types"

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

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/staff/login");
}

export async function searchClientsAction(query: string): Promise<ClientSearchResult[]> {
  return searchClients(query);
}

export async function getClientsListAction(sort: ClientListSort, page: number): Promise<ClientListPage> {
  return getClientsList({ sort, page });
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
    return { error: "This prescription is not active. Sale blocked." };
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
