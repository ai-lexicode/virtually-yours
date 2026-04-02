import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { z } from "zod";
import { sendConfirmationEmail } from "@/lib/resend";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
  companyName: z.string().optional(),
  kvkNumber: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ongeldige invoer", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password, firstName, lastName, companyName, kvkNumber } =
    parsed.data;

  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Use admin.generateLink to create user WITHOUT sending Supabase's default email
  const { data, error } = await serviceClient.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
    },
  });

  if (error) {
    const msg =
      error.message === "A user with this email address has already been registered"
        ? "Dit e-mailadres is al geregistreerd"
        : "Registratie mislukt. Probeer het later opnieuw.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Update profile with company fields
  if (data.user && (companyName || kvkNumber)) {
    await serviceClient
      .from("profiles")
      .update({
        company_name: companyName || null,
        kvk_number: kvkNumber || null,
      })
      .eq("id", data.user.id);
  }

  // Send branded confirmation email via Resend
  const confirmUrl = data.properties?.action_link;
  if (confirmUrl) {
    await sendConfirmationEmail(email, firstName, confirmUrl);
  }

  return NextResponse.json({ success: true });
}
