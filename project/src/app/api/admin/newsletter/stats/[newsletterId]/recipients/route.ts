import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ newsletterId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { newsletterId } = await params;
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    const db = getAdminClient();

    // Verify newsletter exists
    const { data: newsletter } = await db
      .from("newsletters")
      .select("id")
      .eq("id", newsletterId)
      .single();

    if (!newsletter) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const [{ data: items, error }, { count: total }] = await Promise.all([
      db
        .from("newsletter_recipients")
        .select("email, status, delivered_at, opened_at, clicked_at")
        .eq("newsletter_id", newsletterId)
        .order("email", { ascending: true })
        .range(offset, offset + limit - 1),
      db
        .from("newsletter_recipients")
        .select("*", { count: "exact", head: true })
        .eq("newsletter_id", newsletterId),
    ]);

    if (error) throw error;

    return NextResponse.json({
      items: items || [],
      total: total || 0,
      page,
      totalPages: Math.ceil((total || 0) / limit),
    });
  } catch (err) {
    console.error("[Newsletter Recipients] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
