import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ newsletterId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { newsletterId } = await params;
    const db = getAdminClient();

    const { data: newsletter } = await db
      .from("newsletters")
      .select("id, subject, sent_at, recipient_count")
      .eq("id", newsletterId)
      .single();

    if (!newsletter) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const { data: recipients } = await db
      .from("newsletter_recipients")
      .select("id, email, status, delivered_at, opened_at, clicked_at, bounced_at")
      .eq("newsletter_id", newsletterId);

    const all = recipients || [];
    const total = all.length;
    const delivered = all.filter(
      (r) => !["queued", "bounced", "complained"].includes(r.status)
    ).length;
    const opened = all.filter(
      (r) => r.status === "opened" || r.status === "clicked"
    ).length;
    const clicked = all.filter((r) => r.status === "clicked").length;
    const bounced = all.filter((r) => r.status === "bounced").length;
    const complained = all.filter((r) => r.status === "complained").length;

    const openRate = total > 0 ? Math.round((opened / total) * 1000) / 10 : 0;
    const clickRate = total > 0 ? Math.round((clicked / total) * 1000) / 10 : 0;
    const bounceRate = total > 0 ? Math.round((bounced / total) * 1000) / 10 : 0;

    // Click map: aggregate clicks by URL
    const recipientIds = all.map((r) => r.id);
    let clicksByUrl: { url: string; count: number }[] = [];

    if (recipientIds.length > 0) {
      const { data: clicks } = await db
        .from("newsletter_clicks")
        .select("original_url")
        .in("recipient_id", recipientIds);

      const clickMap: Record<string, number> = {};
      for (const c of clicks || []) {
        clickMap[c.original_url] = (clickMap[c.original_url] || 0) + 1;
      }
      clicksByUrl = Object.entries(clickMap)
        .map(([url, count]) => ({ url, count }))
        .sort((a, b) => b.count - a.count);
    }

    const bounces = all
      .filter((r) => r.status === "bounced")
      .map((r) => ({ email: r.email, bouncedAt: r.bounced_at }));

    return NextResponse.json({
      newsletter: {
        id: newsletter.id,
        subject: newsletter.subject,
        sentAt: newsletter.sent_at,
      },
      metrics: {
        total,
        delivered,
        opened,
        clicked,
        bounced,
        complained,
        openRate,
        clickRate,
        bounceRate,
      },
      clicksByUrl,
      bounces,
    });
  } catch (err) {
    console.error("[Newsletter Stats Detail] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
