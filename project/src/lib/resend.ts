import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = process.env.RESEND_FROM_EMAIL || "Virtually Yours <noreply@virtually-yours.nl>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://virtually-yours.nl";

// ─── Branded email wrapper ───────────────────────────────────────────
function brandedHtml(title: string, body: string) {
  return `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="padding:24px 32px;text-align:center;">
          <span style="font-size:28px;font-weight:bold;color:#046bd2;text-decoration:none;">Virtually Yours</span>
        </td></tr>
        <!-- Card -->
        <tr><td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:32px;">
          <h1 style="margin:0 0 16px;font-size:22px;color:#1e293b;">${title}</h1>
          <div style="color:#64748b;font-size:15px;line-height:1.6;">
            ${body}
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#64748b;">
            &copy; ${new Date().getFullYear()} Virtually Yours — Jouw juridische documenten op maat
          </p>
          <p style="margin:4px 0 0;font-size:12px;color:#64748b;">
            KvK: 76053881 | BTW: NL003038893B59 | +31 (0)6 18755103
          </p>
          <p style="margin:8px 0 0;font-size:12px;">
            <a href="${SITE_URL}" style="color:#046bd2;text-decoration:none;">virtually-yours.nl</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(text: string, href: string) {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr><td style="background:#046bd2;border-radius:8px;padding:12px 32px;">
        <a href="${href}" style="color:#ffffff;font-weight:600;font-size:15px;text-decoration:none;display:inline-block;">${text}</a>
      </td></tr>
    </table>`;
}

// ─── Auth emails ─────────────────────────────────────────────────────
export async function sendConfirmationEmail(to: string, name: string, confirmUrl: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Bevestig uw account — Virtually Yours",
    html: brandedHtml(
      "Welkom bij Virtually Yours!",
      `<p style="color:#1e293b;">Beste ${name},</p>
       <p>Bedankt voor uw registratie. Klik op de onderstaande knop om uw e-mailadres te bevestigen en uw account te activeren.</p>
       ${button("Account activeren", confirmUrl)}
       <p>Of kopieer deze link in uw browser:</p>
       <p style="word-break:break-all;font-size:13px;color:#046bd2;">${confirmUrl}</p>
       <p style="margin-top:24px;font-size:13px;">Deze link is 24 uur geldig. Als u geen account heeft aangemaakt, kunt u deze e-mail negeren.</p>`
    ),
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Wachtwoord resetten — Virtually Yours",
    html: brandedHtml(
      "Wachtwoord resetten",
      `<p>U heeft een verzoek ingediend om uw wachtwoord te resetten.</p>
       <p>Klik op de onderstaande knop om een nieuw wachtwoord in te stellen.</p>
       ${button("Nieuw wachtwoord instellen", resetUrl)}
       <p>Of kopieer deze link in uw browser:</p>
       <p style="word-break:break-all;font-size:13px;color:#046bd2;">${resetUrl}</p>
       <p style="margin-top:24px;font-size:13px;">Als u dit verzoek niet heeft ingediend, kunt u deze e-mail negeren. Uw wachtwoord blijft ongewijzigd.</p>`
    ),
  });
}

// ─── Transactional emails ────────────────────────────────────────────
export async function sendPaymentConfirmation(
  to: string,
  orderNumber: number,
  documentTitle: string
) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Betaling ontvangen — bestelling #VY-${orderNumber}`,
    html: brandedHtml(
      "Betaling ontvangen!",
      `<p>Uw betaling voor <strong style="color:#1e293b;">${documentTitle}</strong> is succesvol verwerkt.</p>
       <p>U kunt nu de vragenlijst invullen in uw persoonlijke portaal.</p>
       ${button("Naar mijn portaal", `${SITE_URL}/dashboard`)}
       <p>Bestelnummer: <strong style="color:#1e293b;">#VY-${orderNumber}</strong></p>`
    ),
  });
}

export async function sendDocumentReady(
  to: string,
  orderNumber: number,
  documentTitle: string
) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Uw document is gereed — ${documentTitle}`,
    html: brandedHtml(
      "Uw document is gereed!",
      `<p>Uw <strong style="color:#1e293b;">${documentTitle}</strong> (bestelling #VY-${orderNumber}) is gecontroleerd en klaar voor download.</p>
       <p>U kunt het document downloaden als PDF of Word in uw portaal.</p>
       ${button("Naar downloads", `${SITE_URL}/downloads`)}`,
    ),
  });
}

export async function sendQuestionnaireReminder(
  to: string,
  orderNumber: number,
  documentTitle: string
) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Herinnering: vul uw vragenlijst in — ${documentTitle}`,
    html: brandedHtml(
      "Vergeet uw vragenlijst niet!",
      `<p>U heeft de vragenlijst voor <strong style="color:#1e293b;">${documentTitle}</strong> (bestelling #VY-${orderNumber}) nog niet voltooid.</p>
       <p>Vul de vragenlijst in zodat wij uw document op maat kunnen maken.</p>
       ${button("Vragenlijst invullen", `${SITE_URL}/dashboard`)}`,
    ),
  });
}
