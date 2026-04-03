import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { z } from "zod";
import { getResend } from "@/lib/resend";
import { ContactFormAdminEmail } from "@/emails/ContactFormAdminEmail";
import { ContactFormConfirmationEmail } from "@/emails/ContactFormConfirmationEmail";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(255).optional(),
  subject: z.string().max(200),
  message: z.string().min(10).max(5000),
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ongeldige invoer", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, company, subject, message } = parsed.data;

  const resend = getResend();

  // Send to admin
  await resend.emails.send({
    from: "Virtually Yours Contact <noreply@virtually-yours.nl>",
    to: "info@virtually-yours.nl",
    replyTo: email,
    subject: `[Contact] ${escapeHtml(subject)} — ${escapeHtml(name)}`,
    react: React.createElement(ContactFormAdminEmail, {
      name,
      email,
      company,
      subject,
      message,
    }),
  });

  // Send confirmation to sender
  await resend.emails.send({
    from: "Virtually Yours <noreply@virtually-yours.nl>",
    to: email,
    subject: "Wij hebben uw bericht ontvangen — Virtually Yours",
    react: React.createElement(ContactFormConfirmationEmail, {
      name,
      subject,
      message,
    }),
  });

  return NextResponse.json({ success: true });
}
