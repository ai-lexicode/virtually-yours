import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { sendEmail } from "@/lib/newsletter/send";
import { renderBlocksToHtml, type EmailBlock } from "@/lib/newsletter/render-blocks-to-html";
import { z } from "zod";
import {
  injectTrackingPixel,
  rewriteUrlsForTracking,
} from "@/lib/newsletter/helpers";
import { randomUUID } from "crypto";

const testSchema = z.object({
  subject: z.string().min(1).max(200),
  content: z.array(z.object({
    id: z.string(),
    type: z.string(),
    props: z.record(z.string(), z.unknown()),
    order: z.number(),
  })),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = testSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_BODY", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { subject, content } = validation.data;
    const adminEmail = "info@virtually-yours.nl";

    // Render using the same pipeline as production sends
    const baseHtml = renderBlocksToHtml(content as unknown as EmailBlock[]);
    const fakeRecipientId = randomUUID();
    let html = injectTrackingPixel(baseHtml, fakeRecipientId);
    html = rewriteUrlsForTracking(html, fakeRecipientId);
    html = html.replace(/\{\{unsubscribeUrl\}\}/g, "#");

    const result = await sendEmail({
      to: adminEmail,
      subject: `[TEST] ${subject}`,
      html,
    });

    if (!result?.id) {
      return NextResponse.json({ error: "SEND_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ success: true, email: adminEmail });
  } catch (err) {
    console.error("[Newsletter Test Send] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
