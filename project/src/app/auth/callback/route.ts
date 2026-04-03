import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    console.log("[auth/callback] code present:", !!code, "origin:", origin);

    if (code) {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      console.log("[auth/callback] cookies:", allCookies.map(c => c.name).join(", "));

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            },
          },
        }
      );

      console.log("[auth/callback] exchanging code for session...");
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      console.log("[auth/callback] exchange result:", error ? `ERROR: ${error.message}` : "SUCCESS");

      if (!error) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const serviceClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          );

          const { data: profile } = await serviceClient
            .from("profiles")
            .select("first_name, role")
            .eq("id", user.id)
            .single();

          if (profile?.role === "admin") {
            return NextResponse.redirect(`${origin}/admin`);
          }

          if (!profile?.first_name) {
            return NextResponse.redirect(`${origin}/profiel-aanvullen`);
          }

          return NextResponse.redirect(`${origin}/dashboard`);
        }
      }
    }

    return NextResponse.redirect(`${origin}/inloggen?error=auth`);
  } catch (err) {
    console.error("[auth/callback] UNHANDLED ERROR:", err);
    return NextResponse.redirect(`${origin}/inloggen?error=auth`);
  }
}
