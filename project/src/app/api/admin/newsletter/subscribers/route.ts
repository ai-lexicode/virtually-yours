import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = 20;
    const status = searchParams.get("status"); // active, inactive
    const listId = searchParams.get("listId");

    const db = getAdminClient();

    // Build subscription query
    let subQuery = db
      .from("newsletter_subscriptions")
      .select("user_id, is_active, general, profiles(id, email, first_name, last_name)");

    if (status === "active") subQuery = subQuery.eq("is_active", true);
    if (status === "inactive") subQuery = subQuery.eq("is_active", false);

    const { data: subscriptions } = await subQuery;

    // Build lead query
    let leadQuery = db
      .from("newsletter_leads")
      .select("id, email, first_name, last_name, is_active");

    if (status === "active") leadQuery = leadQuery.eq("is_active", true);
    if (status === "inactive") leadQuery = leadQuery.eq("is_active", false);

    const { data: leads } = await leadQuery;

    type Subscriber = {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
      source: "registered" | "import";
      general: boolean;
      listIds: string[];
    };

    const subscribers: Subscriber[] = [];

    // Add registered users
    for (const sub of subscriptions || []) {
      const profile = sub.profiles as unknown as { id: string; email: string; first_name: string; last_name: string } | null;
      if (!profile) continue;

      // Get list memberships
      const { data: memberships } = await db
        .from("newsletter_list_members")
        .select("list_id")
        .eq("user_id", sub.user_id);

      subscribers.push({
        id: `user-${sub.user_id}`,
        email: profile.email,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        isActive: sub.is_active,
        source: "registered",
        general: sub.general,
        listIds: (memberships || []).map((m) => m.list_id),
      });
    }

    // Add leads
    for (const lead of leads || []) {
      const { data: memberships } = await db
        .from("newsletter_list_members")
        .select("list_id")
        .eq("lead_id", lead.id);

      subscribers.push({
        id: `lead-${lead.id}`,
        email: lead.email,
        firstName: lead.first_name || "",
        lastName: lead.last_name || "",
        isActive: lead.is_active,
        source: "import",
        general: true,
        listIds: (memberships || []).map((m) => m.list_id),
      });
    }

    // Filter by listId
    let filtered = subscribers;
    if (listId) {
      filtered = subscribers.filter((s) => s.listIds.includes(listId));
    }

    // Sort by email
    filtered.sort((a, b) => a.email.localeCompare(b.email));

    // Paginate
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      subscribers: paginated,
      pagination: { page, totalPages, total },
    });
  } catch (err) {
    console.error("[Newsletter Subscribers] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
