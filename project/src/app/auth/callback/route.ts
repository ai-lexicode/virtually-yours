import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
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

    const { error } = await supabase.auth.exchangeCodeForSession(code);

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

  // Fallback: auth failed or no code
  return NextResponse.redirect(`${origin}/inloggen?error=auth`);
}
