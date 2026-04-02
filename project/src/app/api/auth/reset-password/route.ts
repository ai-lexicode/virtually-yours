import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendPasswordResetEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "E-mail is verplicht" }, { status: 400 });
  }

  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Generate password recovery link (doesn't send email)
  const { data, error } = await serviceClient.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/wachtwoord-resetten`,
    },
  });

  if (error || !data.properties?.action_link) {
    // Silent success for security (don't reveal if user exists)
    return NextResponse.json({ success: true });
  }

  await sendPasswordResetEmail(email, data.properties.action_link);

  return NextResponse.json({ success: true });
}
