"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export interface DemoSignInState {
  error: "not_configured" | "failed" | null;
}

// Powers the "Live Demo" button on the B2B pitch page (buds.digital). It never disables
// /staff auth — instead it signs in a dedicated, pre-seeded demo account
// (DEMO_STAFF_EMAIL/PASSWORD, see supabase/seed.sql) so the same code that
// ships to real single-tenant client instances never needs an
// auth-bypass branch, and client instances simply lack these env vars.
export async function demoSignIn(_prevState: DemoSignInState | null, _formData: FormData): Promise<DemoSignInState> {
  const email = process.env.DEMO_STAFF_EMAIL;
  const password = process.env.DEMO_STAFF_PASSWORD;

  if (!email || !password) {
    return { error: "not_configured" };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "failed" };
  }

  redirect("/staff");
}
