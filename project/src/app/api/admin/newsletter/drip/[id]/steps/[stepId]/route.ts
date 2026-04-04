import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod";

const updateStepSchema = z.object({
  delay_days: z.number().int().min(0).optional(),
  subject: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  step_order: z.number().int().min(0).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id, stepId } = await params;
    const body = await request.json();
    const validation = updateStepSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_BODY", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const db = getAdminClient();
    const { data: step, error } = await db
      .from("newsletter_drip_steps")
      .update(validation.data)
      .eq("id", stepId)
      .eq("sequence_id", id)
      .select()
      .single();

    if (error) throw error;
    if (!step) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(step);
  } catch (err) {
    console.error("[Newsletter Drip Steps] PUT failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id, stepId } = await params;
    const db = getAdminClient();

    const { error } = await db
      .from("newsletter_drip_steps")
      .delete()
      .eq("id", stepId)
      .eq("sequence_id", id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Newsletter Drip Steps] DELETE failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
