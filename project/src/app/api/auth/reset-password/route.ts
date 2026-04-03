import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendPasswordResetEmail } from "@/lib/resend";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limited = rateLimit(ip, "auth/reset-password", 3, 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "E-mail is verplicht" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[reset-password] Missing env: SUPABASE_URL or SERVICE_ROLE_KEY");
      return NextResponse.json({ success: true });
    }

    const serviceClient = createServiceClient(supabaseUrl, serviceRoleKey);

    // Generate password recovery link (doesn't send email)
    const { data, error } = await serviceClient.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/wachtwoord-resetten`,
      },
    });

    if (error || !data.properties?.action_link) {
      console.error("[reset-password] generateLink failed:", error?.message);
      // Silent success for security (don't reveal if user exists)
      return NextResponse.json({ success: true });
    }

    try {
      await sendPasswordResetEmail(email, data.properties.action_link);
    } catch (e) {
      console.error("[reset-password] Email send failed:", e);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[reset-password] Unhandled error:", e);
    // Always return success for security (don't reveal internal state)
    return NextResponse.json({ success: true });
  }
}
