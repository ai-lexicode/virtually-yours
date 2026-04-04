import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://virtually-yours.nl";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Inject tracking pixel before </body> in the rendered HTML.
 */
export function injectTrackingPixel(html: string, recipientId: string): string {
  const pixelUrl = `${BASE_URL}/api/newsletter/track/open/${recipientId}`;
  const pixel = `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none;width:1px;height:1px;border:0;" />`;
  return html.replace("</body>", `${pixel}\n</body>`);
}

/**
 * Rewrite all href URLs in the HTML for click tracking.
 * Skips mailto:, unsubscribe links, and tracking URLs.
 */
export function rewriteUrlsForTracking(html: string, recipientId: string): string {
  return html.replace(
    /href="(https?:\/\/[^"]+)"/g,
    (_match, url: string) => {
      if (url.includes("/api/newsletter/track/")) return `href="${url}"`;
      if (url.includes("unsubscribe")) return `href="${url}"`;
      const trackUrl = `${BASE_URL}/api/newsletter/track/click/${recipientId}?url=${encodeURIComponent(url)}`;
      return `href="${trackUrl}"`;
    }
  );
}

/**
 * Resolve unsubscribe URL for a recipient.
 */
export async function resolveUnsubscribeUrl(
  userId: string | null,
  email: string
): Promise<string | undefined> {
  const db = getServiceClient();
  let unsubscribeToken: string | null = null;

  if (userId) {
    const { data: sub } = await db
      .from("newsletter_subscriptions")
      .select("unsubscribe_token")
      .eq("user_id", userId)
      .single();
    unsubscribeToken = sub?.unsubscribe_token ?? null;
  }

  if (!unsubscribeToken) {
    const { data: lead } = await db
      .from("newsletter_leads")
      .select("unsubscribe_token")
      .eq("email", email)
      .single();
    unsubscribeToken = lead?.unsubscribe_token ?? null;
  }

  if (unsubscribeToken) {
    return `${BASE_URL}/api/newsletter/unsubscribe/${unsubscribeToken}`;
  }

  return undefined;
}

/**
 * Get emails that have hard-bounced in any previous newsletter.
 */
async function getHardBouncedEmails(): Promise<Set<string>> {
  const db = getServiceClient();
  const { data } = await db
    .from("newsletter_recipients")
    .select("email")
    .eq("status", "bounced");

  return new Set((data || []).map((r) => r.email));
}

/**
 * Get recipients for a newsletter based on list type.
 */
export async function getRecipients(
  listType: string,
  listId?: string
): Promise<{ email: string; userId?: string }[]> {
  const bouncedEmails = await getHardBouncedEmails();
  const db = getServiceClient();

  let recipients: { email: string; userId?: string }[] = [];

  switch (listType) {
    case "general": {
      // Get active subscriptions with general=true, join profiles for email
      const { data: subs } = await db
        .from("newsletter_subscriptions")
        .select("user_id, profiles(email)")
        .eq("is_active", true)
        .eq("general", true);

      if (subs) {
        for (const s of subs) {
          const profile = s.profiles as unknown as { email: string } | null;
          if (profile?.email) {
            recipients.push({ email: profile.email, userId: s.user_id });
          }
        }
      }

      // Include active leads (confirmed, not user-linked)
      const { data: leads } = await db
        .from("newsletter_leads")
        .select("email")
        .eq("is_active", true)
        .not("confirmed_at", "is", null);

      if (leads) {
        const existingEmails = new Set(recipients.map((r) => r.email));
        for (const l of leads) {
          if (l.email && !existingEmails.has(l.email)) {
            recipients.push({ email: l.email });
          }
        }
      }
      break;
    }
    case "list": {
      if (!listId) return [];

      const { data: members } = await db
        .from("newsletter_list_members")
        .select("user_id, lead_id, profiles(id, email), newsletter_leads(email, is_active)")
        .eq("list_id", listId);

      if (members) {
        for (const m of members) {
          const profile = m.profiles as unknown as { id: string; email: string } | null;
          const lead = m.newsletter_leads as unknown as { email: string; is_active: boolean } | null;

          if (profile?.email) {
            recipients.push({ email: profile.email, userId: profile.id });
          } else if (lead?.email && lead.is_active) {
            recipients.push({ email: lead.email });
          }
        }
      }
      break;
    }
    default:
      return [];
  }

  return recipients.filter((r) => !bouncedEmails.has(r.email));
}
