import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || "";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Verify Svix webhook signature from Resend.
 */
function verifySignature(payload: string, headers: Headers): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn("[Webhook Resend] RESEND_WEBHOOK_SECRET not configured");
    return false;
  }

  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  const svixSignature = headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return false;
  }

  // Check timestamp within 5 minutes
  const timestamp = parseInt(svixTimestamp, 10);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) {
    return false;
  }

  const signedContent = `${svixId}.${svixTimestamp}.${payload}`;

  // Secret may be prefixed with "whsec_"
  const secretBytes = Buffer.from(
    WEBHOOK_SECRET.startsWith("whsec_")
      ? WEBHOOK_SECRET.slice(6)
      : WEBHOOK_SECRET,
    "base64"
  );

  const signature = createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  const expectedSignatures = svixSignature.split(" ");
  for (const expected of expectedSignatures) {
    const parts = expected.split(",");
    if (parts.length === 2 && parts[0] === "v1") {
      try {
        const expectedSig = Buffer.from(parts[1], "base64");
        const actualSig = Buffer.from(signature, "base64");
        if (expectedSig.length === actualSig.length && timingSafeEqual(expectedSig, actualSig)) {
          return true;
        }
      } catch {
        // Invalid base64, try next
      }
    }
  }

  return false;
}

type ResendWebhookEvent = {
  type: string;
  data: {
    email_id?: string;
    to?: string[];
    bounce?: {
      message: string;
      type: "Permanent" | "Transient" | "Undetermined";
      subType?: string;
    };
    [key: string]: unknown;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    if (!verifySignature(body, request.headers)) {
      console.warn("[Webhook Resend] Invalid signature");
      return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 401 });
    }

    const event: ResendWebhookEvent = JSON.parse(body);
    const { type, data } = event;
    const emailId = data.email_id;

    if (!emailId) {
      return NextResponse.json({ received: true });
    }

    const db = getServiceClient();

    // Find recipient by resend_message_id
    const { data: recipient } = await db
      .from("newsletter_recipients")
      .select("id, email, user_id, status, opened_at, clicked_at")
      .eq("resend_message_id", emailId)
      .single();

    if (!recipient) {
      // Not a tracked newsletter email
      return NextResponse.json({ received: true });
    }

    switch (type) {
      case "email.delivered":
        if (recipient.status === "queued" || recipient.status === "sent") {
          await db
            .from("newsletter_recipients")
            .update({ status: "delivered", delivered_at: new Date().toISOString() })
            .eq("id", recipient.id);
        }
        break;

      case "email.opened":
        if (!["clicked", "bounced", "complained"].includes(recipient.status)) {
          await db
            .from("newsletter_recipients")
            .update({
              status: "opened",
              opened_at: recipient.opened_at || new Date().toISOString(),
            })
            .eq("id", recipient.id);
        }
        break;

      case "email.clicked":
        if (!["bounced", "complained"].includes(recipient.status)) {
          await db
            .from("newsletter_recipients")
            .update({
              status: "clicked",
              clicked_at: recipient.clicked_at || new Date().toISOString(),
            })
            .eq("id", recipient.id);
        }
        break;

      case "email.bounced": {
        await db
          .from("newsletter_recipients")
          .update({ status: "bounced", bounced_at: new Date().toISOString() })
          .eq("id", recipient.id);

        const bounceType = data.bounce?.type ?? "Undetermined";
        const isHardBounce = bounceType === "Permanent";

        // Handle user subscription
        if (recipient.user_id) {
          if (isHardBounce) {
            await db
              .from("newsletter_subscriptions")
              .update({ is_active: false })
              .eq("user_id", recipient.user_id);

            // Increment bounce count via RPC or re-fetch
            const { data: sub } = await db
              .from("newsletter_subscriptions")
              .select("bounce_count")
              .eq("user_id", recipient.user_id)
              .single();

            if (sub) {
              await db
                .from("newsletter_subscriptions")
                .update({ bounce_count: (sub.bounce_count || 0) + 1 })
                .eq("user_id", recipient.user_id);
            }
          } else {
            const { data: sub } = await db
              .from("newsletter_subscriptions")
              .select("bounce_count")
              .eq("user_id", recipient.user_id)
              .single();

            if (sub) {
              const newCount = (sub.bounce_count || 0) + 1;
              const updates: Record<string, unknown> = { bounce_count: newCount };
              if (newCount >= 3) {
                updates.is_active = false;
              }
              await db
                .from("newsletter_subscriptions")
                .update(updates)
                .eq("user_id", recipient.user_id);
            }
          }
        }

        // Handle lead
        const { data: lead } = await db
          .from("newsletter_leads")
          .select("id, bounce_count")
          .eq("email", recipient.email)
          .single();

        if (lead) {
          if (isHardBounce) {
            await db
              .from("newsletter_leads")
              .update({ is_active: false, bounce_count: (lead.bounce_count || 0) + 1 })
              .eq("id", lead.id);
          } else {
            const newCount = (lead.bounce_count || 0) + 1;
            const updates: Record<string, unknown> = { bounce_count: newCount };
            if (newCount >= 3) {
              updates.is_active = false;
            }
            await db
              .from("newsletter_leads")
              .update(updates)
              .eq("id", lead.id);
          }
        }

        console.info("[Webhook Resend] Bounce processed", {
          email: recipient.email,
          bounceType,
          isHardBounce,
        });
        break;
      }

      case "email.complained":
        await db
          .from("newsletter_recipients")
          .update({ status: "complained" })
          .eq("id", recipient.id);

        // Deactivate subscription
        if (recipient.user_id) {
          await db
            .from("newsletter_subscriptions")
            .update({ is_active: false })
            .eq("user_id", recipient.user_id);
        }

        // Deactivate lead
        await db
          .from("newsletter_leads")
          .update({ is_active: false })
          .eq("email", recipient.email);
        break;

      default:
        console.info("[Webhook Resend] Unhandled event type", { type });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Webhook Resend] Processing failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
