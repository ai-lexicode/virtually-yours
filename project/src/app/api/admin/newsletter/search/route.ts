import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    const limit = Math.min(20, Math.max(1, parseInt(url.searchParams.get("limit") || "5", 10)));

    const db = getAdminClient();

    let query = db
      .from("newsletters")
      .select("id, subject, sent_at, recipient_count")
      .eq("status", "sent")
      .order("sent_at", { ascending: false })
      .limit(limit);

    if (q) {
      query = query.ilike("subject", `%${q}%`);
    }

    const { data: newsletters, error } = await query;

    if (error) throw error;

    return NextResponse.json({ items: newsletters || [] });
  } catch (err) {
    console.error("[Newsletter Search] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
