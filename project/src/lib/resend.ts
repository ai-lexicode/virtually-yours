import { Resend } from "resend";
import React from "react";
import { render } from "@react-email/render";
import { ConfirmationEmail } from "@/emails/ConfirmationEmail";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";
import { PaymentConfirmationEmail } from "@/emails/PaymentConfirmationEmail";
import { DocumentReadyEmail } from "@/emails/DocumentReadyEmail";
import { QuestionnaireReminderEmail } from "@/emails/QuestionnaireReminderEmail";

export function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export const FROM =
  process.env.RESEND_FROM_EMAIL || "Virtually Yours <noreply@virtually-yours.nl>";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://virtually-yours.nl";

// ─── Auth emails ─────────────────────────────────────────────────────
export async function sendConfirmationEmail(
  to: string,
  name: string,
  confirmUrl: string
) {
  const html = await render(
    React.createElement(ConfirmationEmail, { name, confirmUrl })
  );
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Bevestig uw account — Virtually Yours",
    html,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = await render(
    React.createElement(PasswordResetEmail, { resetUrl })
  );
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Wachtwoord resetten — Virtually Yours",
    html,
  });
}

// ─── Transactional emails ────────────────────────────────────────────
export async function sendPaymentConfirmation(
  to: string,
  orderNumber: number,
  documentTitle: string
) {
  const html = await render(
    React.createElement(PaymentConfirmationEmail, {
      orderNumber,
      documentTitle,
      siteUrl: SITE_URL,
    })
  );
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Betaling ontvangen — bestelling #VY-${orderNumber}`,
    html,
  });
}

export async function sendDocumentReady(
  to: string,
  orderNumber: number,
  documentTitle: string
) {
  const html = await render(
    React.createElement(DocumentReadyEmail, {
      orderNumber,
      documentTitle,
      siteUrl: SITE_URL,
    })
  );
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Uw document is gereed — ${documentTitle}`,
    html,
  });
}

export async function sendQuestionnaireReminder(
  to: string,
  orderNumber: number,
  documentTitle: string
) {
  const html = await render(
    React.createElement(QuestionnaireReminderEmail, {
      orderNumber,
      documentTitle,
      siteUrl: SITE_URL,
    })
  );
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Herinnering: vul uw vragenlijst in — ${documentTitle}`,
    html,
  });
}
