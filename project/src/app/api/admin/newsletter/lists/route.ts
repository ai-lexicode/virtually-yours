import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod/v4";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
});

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const db = getAdminClient();
    const { data: lists, error } = await db
      .from("newsletter_lists")
      .select("id, name, description, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Get member counts
    const listIds = (lists || []).map((l) => l.id);
    const enriched = await Promise.all(
      (lists || []).map(async (l) => {
        const { count } = await db
          .from("newsletter_list_members")
          .select("*", { count: "exact", head: true })
          .eq("list_id", l.id);
        return { ...l, memberCount: count || 0 };
      })
    );

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("[Newsletter Lists] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = createSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_BODY", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const db = getAdminClient();
    const { data: list, error } = await db
      .from("newsletter_lists")
      .insert(validation.data)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(list, { status: 201 });
  } catch (err) {
    console.error("[Newsletter Lists] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
