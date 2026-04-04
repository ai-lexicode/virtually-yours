import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  trigger_type: z.enum(["welcome", "re_engagement"]).optional(),
  is_active: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const db = getAdminClient();

    const { data: sequence, error } = await db
      .from("newsletter_drip_sequences")
      .select("*, newsletter_drip_steps(*)")
      .eq("id", id)
      .single();

    if (error || !sequence) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(sequence);
  } catch (err) {
    console.error("[Newsletter Drip] GET [id] failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_BODY", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const db = getAdminClient();
    const { data: sequence, error } = await db
      .from("newsletter_drip_sequences")
      .update({ ...validation.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!sequence) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(sequence);
  } catch (err) {
    console.error("[Newsletter Drip] PUT [id] failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const db = getAdminClient();

    const { error } = await db
      .from("newsletter_drip_sequences")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Newsletter Drip] DELETE [id] failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
