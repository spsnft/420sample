import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // partners.buds.digital serves the B2B pitch page (/partners) at its root.
  // Host-based rewrite keeps it a separate surface from buds.digital without
  // a second deployment — the public site never links here and vice versa.
  const hostname = request.headers.get("host") || "";
  if (pathname === "/" && hostname.startsWith("partners.")) {
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

  const isLoginRoute = pathname === "/staff/login";

  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/staff/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/staff";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/", "/staff/:path*"],
};
