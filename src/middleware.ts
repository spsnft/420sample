import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/staff")) {
    return NextResponse.next();
  }

  // Supabase isn't configured yet in every environment this branch runs in
  // (see supabase/README.md). Let requests through unguarded rather than
  // 500ing on a missing env var — the /staff layout shows a setup notice.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
      global: {
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // /staff/signup is invite-code gated (see supabase/migrations/0003), not
  // open registration — it just doesn't require an existing session to load,
  // same as the login page.
  const isPublicAuthRoute = pathname === "/staff/login" || pathname === "/staff/signup";

  // Demo instance only (DEMO_AUTO_LOGIN, see .env.example — never set on a
  // real client instance, so auth there is untouched by any of this): a
  // visitor with no session lands straight in the panel as the pre-seeded
  // demo staff account instead of hitting the login form. There is no
  // "your account" to sign into here, and the pitch page's own "Live Demo"
  // button (see app/actions.ts, unaffected by this and still working the
  // same way) already exists to avoid making a prospect find credentials —
  // this just closes the other way in: a bare /staff link with a stale or
  // no cookie.
  if (!user && !isPublicAuthRoute && process.env.DEMO_AUTO_LOGIN === "1") {
    const demoEmail = process.env.DEMO_STAFF_EMAIL;
    const demoPassword = process.env.DEMO_STAFF_PASSWORD;
    if (demoEmail && demoPassword) {
      const { error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPassword });
      // Falls through to the normal login redirect below on failure (bad
      // creds, Supabase unreachable) rather than looping or 500ing.
      if (!error) return response;
    }
  }

  if (!user && !isPublicAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/staff/login";
    return NextResponse.redirect(url);
  }

  if (user && isPublicAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/staff";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/staff/:path*"],
};
