import { createClient } from "@supabase/supabase-js";
import {
  createSession,
  setSessionVariables,
  getSessionFile,
} from "./docassemble";
import { transformForDocassemble } from "./docassemble-transform";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Generate a legal document via DocAssemble after questionnaire completion.
 *
 * Flow:
 * 1. Load questionnaire answers and document metadata
 * 2. Create DocAssemble session for the matching interview
 * 3. Push all answers as variables
 * 4. Retrieve the generated PDF
 * 5. Upload to Supabase Storage
 * 6. Create generated_documents record and update order/questionnaire status
 */
export async function triggerDocumentGeneration(questionnaireId: string) {
  const supabase = getAdminClient();

  // 1. Load questionnaire + document + order info
  const { data: questionnaire, error: qErr } = await supabase
    .from("questionnaires")
    .select(
      "id, order_item_id, order_items(id, order_id, document_id, documents(title, slug, requires_review, docassemble_interview_id), orders(profile_id, order_number))"
    )
    .eq("id", questionnaireId)
    .single();

  if (qErr || !questionnaire) {
    console.error("[generate] Questionnaire not found:", questionnaireId, qErr);
    return;
  }

  const orderItem = questionnaire.order_items as unknown as {
    id: string;
    order_id: string;
    document_id: string;
    documents: { title: string; slug: string; requires_review: boolean; docassemble_interview_id: string | null };
    orders: { profile_id: string; order_number: number };
  };

  // Atomically mark as generating — only proceed if still 'completed'
  const { data: updated, error: guardErr } = await supabase
    .from("questionnaires")
    .update({ status: "generating", updated_at: new Date().toISOString() })
    .eq("id", questionnaireId)
    .eq("status", "completed")
    .select("id");

  if (guardErr || !updated || updated.length === 0) {
    console.log("[generate] Skipped — already generating or not completed");
    return;
  }

  // 2. Load all answers with their question keys
  const { data: answersRows } = await supabase
    .from("questionnaire_answers")
    .select("answer, document_questions(question_key)")
    .eq("questionnaire_id", questionnaireId);

  if (!answersRows || answersRows.length === 0) {
    console.error("[generate] No answers for questionnaire:", questionnaireId);
    await markError(questionnaireId);
    return;
  }

  // Build { question_key: answer } map (raw answers from DB)
  const rawAnswers: Record<string, string> = {};
  for (const row of answersRows) {
    const key = (row.document_questions as unknown as { question_key: string })
      ?.question_key;
    if (key && row.answer) {
      rawAnswers[key] = row.answer;
    }
  }

  // Transform answers to DocAssemble variable format
  const variables = transformForDocassemble(
    orderItem.documents.slug,
    rawAnswers
  );

  try {
    // 3. Create DocAssemble session using the API interview
    const interviewId = orderItem.documents.docassemble_interview_id;
    if (!interviewId) {
      console.error("[generate] No docassemble_interview_id for document:", orderItem.documents.slug);
      await markError(questionnaireId);
      return;
    }
    const session = await createSession(interviewId);

    // 4. Send all variables in a single POST — the API interview returns the PDF attachment directly
    const result = await setSessionVariables(session, variables);

    // 5. Extract attachment from response
    const attachments = result?.attachments;
    if (!attachments || attachments.length === 0) {
      console.error("[generate] No attachments in response. questionType:", result?.questionType);
      if (result?.questionType === "undefined_variable") {
        console.error("[generate] Missing variable:", result?.variable);
      }
      await markError(questionnaireId);
      return;
    }

    const attachment = attachments[0];
    const fileNumber = attachment?.number?.pdf;

    if (!fileNumber) {
      console.error("[generate] No file number in attachment:", JSON.stringify(attachment?.number));
      await markError(questionnaireId);
      return;
    }

    // Download via /api/file/{number} endpoint (the only reliable method)
    const pdfBuffer = await getSessionFile(
      session,
      `/api/file/${fileNumber}`
    );

    // 6. Upload to Supabase Storage
    const fileName = `${orderItem.orders.order_number}/${orderItem.documents.slug}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("[generate] Upload error:", uploadError);
      await markError(questionnaireId);
      return;
    }

    // 7. Create generated_documents record
    await supabase.from("generated_documents").insert({
      order_item_id: orderItem.id,
      storage_path: fileName,
      file_type: "pdf",
      version: 1,
      status: "generated",
    });

    // 8. Update questionnaire status
    await supabase
      .from("questionnaires")
      .update({
        status: "completed",
        docassemble_session_id: session.session,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", questionnaireId);

    // 9. Update order status
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

    console.log(
      "[generate] Document generated:",
      fileName,
      "for questionnaire:",
      questionnaireId
    );
  } catch (err) {
    console.error("[generate] Generation error:", err);
    await markError(questionnaireId);
  }
}

async function markError(questionnaireId: string) {
  const supabase = getAdminClient();
  await supabase
    .from("questionnaires")
    .update({ status: "error", updated_at: new Date().toISOString() })
    .eq("id", questionnaireId);
}
