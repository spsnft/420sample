import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Server Components / Server Actions client. Reads the session from cookies
// and enforces the RLS policies defined in supabase/migrations — there is no
// service-role bypass anywhere in the app.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called during a Server Component render, where cookies can't be
            // written. The middleware below refreshes the session instead.
          }
        },
      },
    }
  );
}
