import { NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const db = getAdminClient();

    // Fetch registered subscribers
    const { data: subscriptions } = await db
      .from("newsletter_subscriptions")
      .select("is_active, general, profiles(email, first_name, last_name)");

    // Fetch leads
    const { data: leads } = await db
      .from("newsletter_leads")
      .select("email, first_name, last_name, is_active");

    // Build CSV
    const rows: string[] = [
      "email,firstName,lastName,status,source,general",
    ];

    for (const sub of subscriptions || []) {
      const profile = sub.profiles as unknown as { email: string; first_name: string; last_name: string } | null;
      if (!profile) continue;
      rows.push(
        [
          csvEscape(profile.email),
          csvEscape(profile.first_name || ""),
          csvEscape(profile.last_name || ""),
          sub.is_active ? "active" : "inactive",
          "registered",
          sub.general ? "yes" : "no",
        ].join(",")
      );
    }

    for (const lead of leads || []) {
      rows.push(
        [
          csvEscape(lead.email),
          csvEscape(lead.first_name || ""),
          csvEscape(lead.last_name || ""),
          lead.is_active ? "active" : "inactive",
          "import",
          "yes",
        ].join(",")
      );
    }

    const csv = rows.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err) {
    console.error("[Newsletter Export] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
