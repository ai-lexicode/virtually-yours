import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.DOCASSEMBLE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { questionnaireId, status, fileUrl } = await request.json();

  if (!questionnaireId || !status) {
    return NextResponse.json(
      { error: "Missing questionnaireId or status" },
      { status: 400 }
    );
  }

  // Get questionnaire with related order info
  const { data: questionnaire, error: qError } = await supabase
    .from("questionnaires")
    .select("*, order_items(*, orders(*), documents(*))")
    .eq("id", questionnaireId)
    .single();

  if (qError || !questionnaire) {
    return NextResponse.json(
      { error: "Questionnaire not found" },
      { status: 404 }
    );
  }

  if (status === "completed" && fileUrl) {
    const orderItem = questionnaire.order_items as unknown as {
      id: string;
      order_id: string;
      documents: { requires_review: boolean; title: string };
      orders: { profile_id: string; order_number: number };
    };

    // Idempotency guard: skip if generate-document.ts already created a record
    const { count: existingDocs } = await supabase
      .from("generated_documents")
      .select("id", { count: "exact", head: true })
      .eq("order_item_id", orderItem.id);

    if (existingDocs && existingDocs > 0) {
      return NextResponse.json({ success: true, skipped: "already_generated" });
    }

    // Update questionnaire status
    await supabase
      .from("questionnaires")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", questionnaireId);

    // Create generated document record
    await supabase.from("generated_documents").insert({
      order_item_id: orderItem.id,
      storage_path: fileUrl,
      file_type: "pdf",
      version: 1,
      status: "generated",
    });

    // Check if document requires manual review
    if (orderItem.documents.requires_review) {
      await supabase
        .from("orders")
        .update({ status: "review" })
        .eq("id", orderItem.order_id);

      await supabase.from("activity_log").insert({
        actor_id: orderItem.orders.profile_id,
        action: "document_ready_for_review",
        entity_type: "order",
        entity_id: orderItem.order_id,
        metadata: { document: orderItem.documents.title },
      });
    } else {
      // Auto-deliver
      await supabase
        .from("orders")
        .update({ status: "completed" })
        .eq("id", orderItem.order_id);

      await supabase.from("activity_log").insert({
        actor_id: orderItem.orders.profile_id,
        action: "document_auto_delivered",
        entity_type: "order",
        entity_id: orderItem.order_id,
        metadata: { document: orderItem.documents.title },
      });
    }
  }

  return NextResponse.json({ success: true });
}
