import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // buds.digital (the apex domain) serves the B2B pitch page (/partners) at
  // its root — the product's main marketing surface, meant to be found by
  // search. The consumer storefront demo lives at partners.buds.digital
  // instead (see siteConfig.url); "partners." is now a legacy subdomain name
  // for a demo host, not a description of what it serves. Host-based rewrite
  // keeps this one deployment answering both without a second build.
  const hostname = request.headers.get("host") || "";
  if (pathname === "/" && (hostname === "buds.digital" || hostname === "www.buds.digital")) {
    const url = request.nextUrl.clone();
    url.pathname = "/partners";
    return NextResponse.rewrite(url);
  }

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
  matcher: ["/", "/staff/:path*"],
};
