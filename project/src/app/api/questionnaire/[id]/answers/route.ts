import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { triggerDocumentGeneration } from "@/lib/generate-document";

// GET: Load questionnaire with its questions and saved answers
export async function GET(
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

  // Fetch questionnaire with document info through order_items
  const { data: questionnaire, error: qError } = await supabase
    .from("questionnaires")
    .select(
      "id, status, progress_percentage, order_items(document_id, documents(title, slug), orders!inner(order_number, profile_id))"
    )
    .eq("id", id)
    .eq("order_items.orders.profile_id", user.id)
    .single();

  if (qError || !questionnaire) {
    return NextResponse.json(
      { error: "Questionnaire not found" },
      { status: 404 }
    );
  }

  const orderItem = questionnaire.order_items as unknown as {
    document_id: string;
    documents: { title: string; slug: string };
    orders: { order_number: string };
  };

  // Fetch questions for this document type
  const { data: questions } = await supabase
    .from("document_questions")
    .select("id, sort_order, question_key, question_text, question_type, placeholder, options, is_required, help_text")
    .eq("document_id", orderItem.document_id)
    .order("sort_order", { ascending: true });

  // Fetch saved answers for this questionnaire
  const { data: answers } = await supabase
    .from("questionnaire_answers")
    .select("question_id, answer")
    .eq("questionnaire_id", id);

  // Map answers to a { question_id: answer } object
  const answersMap: Record<string, string> = {};
  for (const a of answers || []) {
    answersMap[a.question_id] = a.answer ?? "";
  }

  return NextResponse.json({
    questionnaire: {
      id: questionnaire.id,
      status: questionnaire.status,
      progress: questionnaire.progress_percentage,
      documentTitle: orderItem.documents?.title ?? "Document",
      documentSlug: orderItem.documents?.slug ?? "",
      orderNumber: orderItem.orders?.order_number ?? "-",
    },
    questions: questions || [],
    answers: answersMap,
  });
}

// POST: Save one or more answers (autosave)
export async function POST(
  req: NextRequest,
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

  const body = await req.json();
  const { answers } = body as {
    answers: { question_id: string; answer: string }[];
  };

  if (!answers || !Array.isArray(answers)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Verify ownership
  const { data: questionnaire } = await supabase
    .from("questionnaires")
    .select(
      "id, order_items(document_id, orders!inner(profile_id))"
    )
    .eq("id", id)
    .eq("order_items.orders.profile_id", user.id)
    .single();

  if (!questionnaire) {
    return NextResponse.json(
      { error: "Questionnaire not found" },
      { status: 404 }
    );
  }

  // Upsert answers
  const upserts = answers.map((a) => ({
    questionnaire_id: id,
    question_id: a.question_id,
    answer: a.answer,
    saved_at: new Date().toISOString(),
  }));

  const { error: upsertError } = await supabase
    .from("questionnaire_answers")
    .upsert(upserts, { onConflict: "questionnaire_id,question_id" });

  if (upsertError) {
    return NextResponse.json(
      { error: "Failed to save answers" },
      { status: 500 }
    );
  }

  // Get only REQUIRED questions to calculate progress
  const orderItem = questionnaire.order_items as unknown as {
    document_id: string;
  };

  const { data: requiredQuestions } = await supabase
    .from("document_questions")
    .select("id")
    .eq("document_id", orderItem.document_id)
    .eq("is_required", true);

  const requiredIds = new Set((requiredQuestions || []).map((q) => q.id));
  const totalRequired = requiredIds.size;

  // Count how many required questions have non-empty answers
  const { data: allAnswers } = await supabase
    .from("questionnaire_answers")
    .select("question_id, answer")
    .eq("questionnaire_id", id);

  const answeredRequiredCount = (allAnswers || []).filter(
    (a) => requiredIds.has(a.question_id) && a.answer && a.answer.trim() !== ""
  ).length;

  const progress =
    totalRequired > 0
      ? Math.round((answeredRequiredCount / totalRequired) * 100)
      : 0;

  // Update questionnaire status and progress
  const newStatus =
    progress === 0
      ? "not_started"
      : progress === 100
        ? "completed"
        : "in_progress";

  await supabase
    .from("questionnaires")
    .update({
      status: newStatus,
      progress_percentage: progress,
      started_at:
        newStatus !== "not_started" ? new Date().toISOString() : null,
      completed_at:
        newStatus === "completed" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  // Trigger document generation when questionnaire is completed
  if (newStatus === "completed") {
    // Fire-and-forget: don't block the response
    triggerDocumentGeneration(id).catch((err) =>
      console.error("[answers] Failed to trigger generation:", err)
    );
  }

  return NextResponse.json({ saved: true, progress, status: newStatus });
}
