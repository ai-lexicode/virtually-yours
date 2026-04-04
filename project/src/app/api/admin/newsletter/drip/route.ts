import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  trigger_type: z.enum(["welcome", "re_engagement"]),
  is_active: z.boolean().optional(),
});

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const db = getAdminClient();
    const { data: sequences, error } = await db
      .from("newsletter_drip_sequences")
      .select("*, newsletter_drip_steps(count)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const enriched = (sequences || []).map((s) => ({
      ...s,
      step_count: s.newsletter_drip_steps?.[0]?.count ?? 0,
    }));

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("[Newsletter Drip] GET failed", err);
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
    const { data: sequence, error } = await db
      .from("newsletter_drip_sequences")
      .insert(validation.data)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(sequence, { status: 201 });
  } catch (err) {
    console.error("[Newsletter Drip] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
