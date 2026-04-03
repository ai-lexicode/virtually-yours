import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { sendEmail } from "@/lib/newsletter/send";
import { renderBlocksToHtml, type EmailBlock } from "@/lib/newsletter/render-blocks-to-html";
import { z } from "zod";
import {
  injectTrackingPixel,
  rewriteUrlsForTracking,
  resolveUnsubscribeUrl,
} from "@/lib/newsletter/helpers";

const BATCH_SIZE = 50;

const processSchema = z.object({
  newsletterId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = processSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_BODY", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { newsletterId } = validation.data;
    const db = getAdminClient();

    // Verify newsletter exists and is in sending state
    const { data: newsletter } = await db
      .from("newsletters")
      .select("id, subject, content, status")
      .eq("id", newsletterId)
      .single();

    if (!newsletter) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    if (newsletter.status !== "sending") {
      return NextResponse.json({ error: "NOT_SENDING", status: newsletter.status }, { status: 400 });
    }

    // Get counts for progress
    const { data: allRecipients } = await db
      .from("newsletter_recipients")
      .select("id, status")
      .eq("newsletter_id", newsletterId);

    const all = allRecipients || [];
    const total = all.length;
    const queuedCount = all.filter((r) => r.status === "queued").length;

    // No more to process
    if (queuedCount === 0) {
      await db
        .from("newsletters")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", newsletterId);

      const sent = all.filter((r) => r.status === "sent" || r.status === "delivered" || r.status === "opened" || r.status === "clicked").length;
      const failed = all.filter((r) => r.status === "bounced").length;

      return NextResponse.json({ done: true, sent, failed, total });
    }

    // Get next batch of queued recipients
    const { data: batch } = await db
      .from("newsletter_recipients")
      .select("id, email, user_id")
      .eq("newsletter_id", newsletterId)
      .eq("status", "queued")
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    // Render base HTML from newsletter content
    const baseHtml = renderBlocksToHtml(newsletter.content as unknown as EmailBlock[]);

    // Process each recipient
    await Promise.all(
      (batch || []).map(async (rec) => {
        try {
          let html = injectTrackingPixel(baseHtml, rec.id);
          html = rewriteUrlsForTracking(html, rec.id);

          const unsubscribeUrl = await resolveUnsubscribeUrl(rec.user_id, rec.email);
          if (unsubscribeUrl) {
            html = html.replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);
          }

          const result = await sendEmail({
            to: rec.email,
            subject: newsletter.subject,
            html,
            unsubscribeUrl,
          });

          if (result?.id) {
            await db
              .from("newsletter_recipients")
              .update({ resend_message_id: result.id, status: "sent" })
              .eq("id", rec.id);
          } else {
            await db
              .from("newsletter_recipients")
              .update({ status: "bounced" })
              .eq("id", rec.id);
          }
        } catch (err) {
          console.error("[Newsletter Process] Failed to send", { recipientId: rec.id, err });
          await db
            .from("newsletter_recipients")
            .update({ status: "bounced" })
            .eq("id", rec.id)
            .then(() => {});
        }
      })
    );

    // Re-count after processing
    const { data: updatedAll } = await db
      .from("newsletter_recipients")
      .select("status")
      .eq("newsletter_id", newsletterId);

    const updated = updatedAll || [];
    const newSent = updated.filter((r) => ["sent", "delivered", "opened", "clicked"].includes(r.status)).length;
    const newFailed = updated.filter((r) => r.status === "bounced").length;
    const newQueued = updated.filter((r) => r.status === "queued").length;
    const done = newQueued === 0;

    if (done) {
      await db
        .from("newsletters")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", newsletterId);
    }

    return NextResponse.json({ done, sent: newSent, failed: newFailed, total });
  } catch (err) {
    console.error("[Newsletter Process] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
