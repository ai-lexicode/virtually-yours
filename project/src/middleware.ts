import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected portal routes
  const portalRoutes = [
    "/dashboard",
    "/vragenlijsten",
    "/documenten-portal",
    "/downloads",
    "/facturen",
    "/instellingen",
  ];

  const isPortalRoute = portalRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isAdminRoute = pathname.startsWith("/admin");

  // Redirect unauthenticated users to login
  if ((isPortalRoute || isAdminRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/inloggen";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Service client for role checks (bypasses RLS)
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Helper to get user role
  async function getUserRole(userId: string): Promise<string | null> {
    const { data } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    return data?.role || null;
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === "/inloggen" || pathname === "/registreren")) {
    const role = await getUserRole(user.id);
    const url = request.nextUrl.clone();
    url.pathname = role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(url);
  }

  // Redirect admin users from dashboard to admin portal
  if (pathname === "/dashboard" && user) {
    const role = await getUserRole(user.id);
    if (role === "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  // Admin role check
  if (isAdminRoute && user) {
    const role = await getUserRole(user.id);
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
