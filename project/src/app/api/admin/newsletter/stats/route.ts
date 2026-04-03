import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const db = getAdminClient();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      { count: totalSent },
      { count: totalSubscribers },
      { data: recentRecipients },
    ] = await Promise.all([
      db.from("newsletters").select("*", { count: "exact", head: true }).eq("status", "sent"),
      db.from("newsletter_subscriptions").select("*", { count: "exact", head: true }).eq("is_active", true),
      db.from("newsletter_recipients").select("status, created_at").gte("created_at", thirtyDaysAgo.toISOString()),
    ]);

    const recipients = recentRecipients || [];
    const totalRecipients = recipients.length;
    const openedCount = recipients.filter(
      (r) => r.status === "opened" || r.status === "clicked"
    ).length;
    const clickedCount = recipients.filter((r) => r.status === "clicked").length;

    const avgOpenRate = totalRecipients > 0 ? (openedCount / totalRecipients) * 100 : 0;
    const avgClickRate = totalRecipients > 0 ? (clickedCount / totalRecipients) * 100 : 0;

    // Trend data: daily counts for last 30 days
    const trendMap = new Map<string, { sent: number; opened: number; clicked: number }>();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      trendMap.set(date.toISOString().split("T")[0], { sent: 0, opened: 0, clicked: 0 });
    }

    for (const r of recipients) {
      const key = new Date(r.created_at).toISOString().split("T")[0];
      const entry = trendMap.get(key);
      if (entry) {
        entry.sent++;
        if (r.status === "opened" || r.status === "clicked") entry.opened++;
        if (r.status === "clicked") entry.clicked++;
      }
    }

    const trend = Array.from(trendMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      totalSent: totalSent || 0,
      totalSubscribers: totalSubscribers || 0,
      avgOpenRate: Math.round(avgOpenRate * 10) / 10,
      avgClickRate: Math.round(avgClickRate * 10) / 10,
      trend,
    });
  } catch (err) {
    console.error("[Newsletter Stats] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
