import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { triggerDocumentGeneration } from "@/lib/generate-document";

// POST: Retry a failed document generation
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership and that status is 'error'
  const { data: questionnaire } = await supabase
    .from("questionnaires")
    .select("id, status, order_items(orders!inner(profile_id))")
    .eq("id", id)
    .eq("order_items.orders.profile_id", user.id)
    .single();

  if (!questionnaire) {
    return NextResponse.json(
      { error: "Questionnaire not found" },
      { status: 404 }
    );
  }

  if (questionnaire.status !== "error") {
    return NextResponse.json(
      { error: "Only failed questionnaires can be retried" },
      { status: 400 }
    );
  }

  // Reset status to 'completed' so the generation guard allows it
  await supabase
    .from("questionnaires")
    .update({
      status: "completed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  // Trigger generation (fire-and-forget)
  triggerDocumentGeneration(id).catch((err) =>
    console.error("[retry] Failed to trigger generation:", err)
  );

  return NextResponse.json({ success: true, status: "retrying" });
}
