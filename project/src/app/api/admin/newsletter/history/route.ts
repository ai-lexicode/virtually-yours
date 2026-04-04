import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const offset = (page - 1) * limit;

    const db = getAdminClient();

    const [{ data: items, error }, { count: total }] = await Promise.all([
      db
        .from("newsletters")
        .select("id, subject, list_type, list_id, recipient_count, sent_by, sent_at, created_at")
        .eq("status", "sent")
        .order("sent_at", { ascending: false })
        .range(offset, offset + limit - 1),
      db
        .from("newsletters")
        .select("*", { count: "exact", head: true })
        .eq("status", "sent"),
    ]);

    if (error) throw error;

    // Resolve sent_by user names
    const sentByIds = [...new Set((items || []).map((i) => i.sent_by).filter(Boolean))];
    let userMap = new Map<string, string>();

    if (sentByIds.length > 0) {
      const { data: users } = await db
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", sentByIds);
      userMap = new Map(
        (users || []).map((u) => [u.id, `${u.first_name || ""} ${u.last_name || ""}`.trim()])
      );
    }

    // Fetch recipient stats per newsletter for open/click rates
    const newsletterIds = (items || []).map((i) => i.id);
    let statsMap = new Map<string, { openRate: number; clickRate: number }>();

    if (newsletterIds.length > 0) {
      const { data: recipientRows } = await db
        .from("newsletter_recipients")
        .select("newsletter_id, status")
        .in("newsletter_id", newsletterIds);

      const grouped: Record<string, { total: number; opened: number; clicked: number }> = {};
      for (const r of recipientRows || []) {
        if (!grouped[r.newsletter_id]) grouped[r.newsletter_id] = { total: 0, opened: 0, clicked: 0 };
        grouped[r.newsletter_id].total++;
        if (r.status === "opened" || r.status === "clicked") grouped[r.newsletter_id].opened++;
        if (r.status === "clicked") grouped[r.newsletter_id].clicked++;
      }

      for (const [nid, g] of Object.entries(grouped)) {
        statsMap.set(nid, {
          openRate: g.total > 0 ? Math.round((g.opened / g.total) * 1000) / 10 : 0,
          clickRate: g.total > 0 ? Math.round((g.clicked / g.total) * 1000) / 10 : 0,
        });
      }
    }

    const enrichedItems = (items || []).map((item) => ({
      id: item.id,
      subject: item.subject,
      listType: item.list_type,
      listId: item.list_id,
      recipientCount: item.recipient_count,
      sentBy: userMap.get(item.sent_by) || "Unknown",
      sentAt: item.sent_at || item.created_at,
      openRate: statsMap.get(item.id)?.openRate ?? 0,
      clickRate: statsMap.get(item.id)?.clickRate ?? 0,
    }));

    return NextResponse.json({
      items: enrichedItems,
      total: total || 0,
      page,
      totalPages: Math.ceil((total || 0) / limit),
    });
  } catch (err) {
    console.error("[Newsletter History] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
