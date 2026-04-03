import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const listType = searchParams.get("listType") || "general";
    const listId = searchParams.get("listId") || undefined;

    const db = getAdminClient();
    let count = 0;

    switch (listType) {
      case "general": {
        const { count: c } = await db
          .from("newsletter_subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true)
          .eq("general", true);
        count = c || 0;
        break;
      }
      case "list": {
        if (listId) {
          const { count: c } = await db
            .from("newsletter_list_members")
            .select("*", { count: "exact", head: true })
            .eq("list_id", listId);
          count = c || 0;
        }
        break;
      }
    }

    // Return lists for dropdown
    const { data: lists } = await db
      .from("newsletter_lists")
      .select("id, name")
      .order("name", { ascending: true });

    const enrichedLists = await Promise.all(
      (lists || []).map(async (l) => {
        const { count: c } = await db
          .from("newsletter_list_members")
          .select("*", { count: "exact", head: true })
          .eq("list_id", l.id);
        return { id: l.id, name: l.name, memberCount: c || 0 };
      })
    );

    return NextResponse.json({ count, lists: enrichedLists });
  } catch (err) {
    console.error("[Newsletter Audience] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
