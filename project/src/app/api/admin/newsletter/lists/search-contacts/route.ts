import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    if (q.length < 2) {
      return NextResponse.json([]);
    }

    const db = getAdminClient();

    // Search profiles
    const { data: users } = await db
      .from("profiles")
      .select("id, email, first_name, last_name")
      .or(`email.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`)
      .limit(5);

    // Search leads
    const { data: leads } = await db
      .from("newsletter_leads")
      .select("id, email, first_name, last_name")
      .eq("is_active", true)
      .or(`email.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`)
      .limit(5);

    const results = [
      ...(users || []).map((u) => ({
        id: u.id,
        type: "user" as const,
        email: u.email,
        firstName: u.first_name || "",
        lastName: u.last_name || "",
      })),
      ...(leads || []).map((l) => ({
        id: l.id,
        type: "lead" as const,
        email: l.email,
        firstName: l.first_name || "",
        lastName: l.last_name || "",
      })),
    ].slice(0, 10);

    return NextResponse.json(results);
  } catch (err) {
    console.error("[Newsletter Search Contacts] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
