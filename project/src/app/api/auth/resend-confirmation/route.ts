import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendConfirmationEmail } from "@/lib/resend";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limited = rateLimit(ip, "auth/resend-confirmation", 3, 60 * 60 * 1000);
  if (limited) return limited;

  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "E-mail is verplicht" }, { status: 400 });
  }

  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find user by email
  const { data: { users } } = await serviceClient.auth.admin.listUsers();
  const user = users.find((u) => u.email === email);

  if (!user || user.email_confirmed_at) {
    // Don't reveal if user exists or not
    return NextResponse.json({ success: true });
  }

  // Generate a new confirmation link
  const { data, error } = await serviceClient.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
    },
  });

  if (error || !data.properties?.action_link) {
    return NextResponse.json({ success: true }); // Silent fail for security
  }

  const name = user.user_metadata?.first_name || "gebruiker";
  try {
    await sendConfirmationEmail(email, name, data.properties.action_link);
  } catch (e) {
    console.error("[resend-confirmation] Email send failed:", e);
  }

  return NextResponse.json({ success: true });
}
