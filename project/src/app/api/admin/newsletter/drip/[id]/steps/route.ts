import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod";

const createStepSchema = z.object({
  delay_days: z.number().int().min(0),
  subject: z.string().min(1).max(500),
  content: z.string().min(1),
  step_order: z.number().int().min(0),
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

    const { data: steps, error } = await db
      .from("newsletter_drip_steps")
      .select("*")
      .eq("sequence_id", id)
      .order("step_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json(steps || []);
  } catch (err) {
    console.error("[Newsletter Drip Steps] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const validation = createStepSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_BODY", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const db = getAdminClient();
    const { data: step, error } = await db
      .from("newsletter_drip_steps")
      .insert({ ...validation.data, sequence_id: id })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(step, { status: 201 });
  } catch (err) {
    console.error("[Newsletter Drip Steps] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
