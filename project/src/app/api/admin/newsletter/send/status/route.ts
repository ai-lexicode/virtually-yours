import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });
    }

    const db = getAdminClient();
    const { data: newsletter } = await db
      .from("newsletters")
      .select("id, status")
      .eq("id", id)
      .single();

    if (!newsletter) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const { data: recipients } = await db
      .from("newsletter_recipients")
      .select("status")
      .eq("newsletter_id", id);

    const all = recipients || [];
    const total = all.length;
    const sent = all.filter((r) => ["sent", "delivered", "opened", "clicked"].includes(r.status)).length;
    const failed = all.filter((r) => r.status === "bounced").length;
    const queued = all.filter((r) => r.status === "queued").length;

    return NextResponse.json({
      total,
      sent,
      failed,
      queued,
      done: queued === 0 && total > 0,
      newsletterStatus: newsletter.status,
    });
  } catch {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
