import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

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

  // Send to admin
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Virtually Yours Contact <noreply@virtually-yours.nl>",
    to: "info@virtually-yours.nl",
    replyTo: email,
    subject: `[Contact] ${escapeHtml(subject)} — ${escapeHtml(name)}`,
    html: `
      <h2>Nieuw contactbericht</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; font-weight: bold;">Naam:</td><td style="padding: 8px;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">E-mail:</td><td style="padding: 8px;">${escapeHtml(email)}</td></tr>
        ${company ? `<tr><td style="padding: 8px; font-weight: bold;">Bedrijf:</td><td style="padding: 8px;">${escapeHtml(company)}</td></tr>` : ""}
        <tr><td style="padding: 8px; font-weight: bold;">Onderwerp:</td><td style="padding: 8px;">${escapeHtml(subject)}</td></tr>
      </table>
      <h3>Bericht:</h3>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });

  // Send confirmation to sender
  await resend.emails.send({
    from: "Virtually Yours <noreply@virtually-yours.nl>",
    to: email,
    subject: "Wij hebben uw bericht ontvangen — Virtually Yours",
    html: `
      <h2>Bedankt voor uw bericht, ${escapeHtml(name)}!</h2>
      <p>Wij hebben uw bericht ontvangen en reageren binnen 24 uur op werkdagen.</p>
      <p><strong>Onderwerp:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Uw bericht:</strong></p>
      <blockquote style="border-left: 3px solid #ccc; padding-left: 12px; color: #666;">${escapeHtml(message).replace(/\n/g, "<br>")}</blockquote>
      <p>Met vriendelijke groet,<br>Het Virtually Yours team</p>
    `,
  });

  return NextResponse.json({ success: true });
}
