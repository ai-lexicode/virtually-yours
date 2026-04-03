import { getResend, FROM } from "@/lib/resend";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  unsubscribeUrl?: string;
  replyTo?: string;
};

/**
 * Strip HTML tags and decode entities to produce a plain-text fallback.
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/td>/gi, " ")
    .replace(/<hr[^>]*>/gi, "\n---\n")
    .replace(/<a[^>]+href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, "$2 ($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function sendEmail({ to, subject, html, unsubscribeUrl, replyTo }: SendEmailParams) {
  const resend = getResend();

  const headers: Record<string, string> = {};
  if (unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      text: htmlToPlainText(html),
      ...(replyTo && { replyTo }),
      ...(Object.keys(headers).length > 0 && { headers }),
    });

    if (error) {
      console.error("[Newsletter] Failed to send email", { to, subject, error });
      return null;
    }

    return data;
  } catch (err) {
    console.error("[Newsletter] Unexpected email error", { to, subject, err });
    return null;
  }
}
