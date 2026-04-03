import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import React from "react";
import { z } from "zod";
import { getResend, SITE_URL } from "@/lib/resend";
import { DocumentApprovedEmail } from "@/emails/DocumentApprovedEmail";
import { DocumentRejectedEmail } from "@/emails/DocumentRejectedEmail";
import { ChangesRequestedEmail } from "@/emails/ChangesRequestedEmail";

function getAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = getAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin" ? user : null;
}

// GET: List items waiting for review
export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  const admin = getAdminClient();
  const { data } = await admin
    .from("order_items")
    .select(
      "id, order_id, created_at, documents(title), orders!inner(id, order_number, status, profiles(first_name, last_name, company_name))"
    )
    .eq("orders.status", "review")
    .order("created_at", { ascending: true });

  const items = (data || []).map((item) => {
    const doc = item.documents as unknown as { title: string } | null;
    const order = item.orders as unknown as {
      id: string;
      order_number: string;
      profiles: { first_name: string; last_name: string; company_name: string } | null;
    } | null;

    const profile = order?.profiles;
    const name = profile
      ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
      : "-";

    return {
      id: item.id,
      orderUuid: item.order_id,
      orderId: order?.order_number ?? "-",
      customer: name,
      company: profile?.company_name ?? "-",
      document: doc?.title ?? "Document",
      submittedAt: item.created_at
        ? new Date(item.created_at).toLocaleDateString("nl-NL")
        : "-",
    };
  });

  return NextResponse.json(items);
}

const reviewSchema = z.object({
  orderId: z.string().uuid(),
  action: z.enum(["approve", "reject", "request_changes"]),
  note: z.string().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ongeldige invoer", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { orderId, action, note } = parsed.data;

  const admin = getAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("*, profiles(email, first_name), order_items(*, documents(title))")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json(
      { error: "Bestelling niet gevonden" },
      { status: 404 }
    );
  }

  const orderProfile = order.profiles as unknown as {
    email: string;
    first_name: string;
  };
  const orderItems = order.order_items as unknown as {
    documents: { title: string };
  }[];
  const docTitle = orderItems[0]?.documents.title || "Document";
  const resend = getResend();

  if (action === "approve") {
    // Update order status to delivered
    await admin
      .from("orders")
      .update({ status: "completed" })
      .eq("id", orderId);

    // Send email notification
    await resend.emails.send({
      from: "Virtually Yours <noreply@virtually-yours.nl>",
      to: orderProfile.email,
      subject: `Uw document "${docTitle}" is gereed`,
      react: React.createElement(DocumentApprovedEmail, {
        firstName: orderProfile.first_name,
        docTitle,
        note,
        siteUrl: SITE_URL,
      }),
    });

    await admin.from("activity_log").insert({
      actor_id: user.id,
      action: "document_approved",
      entity_type: "order",
      entity_id: orderId,
      metadata: { document: docTitle, reviewedBy: user.id },
    });
  } else if (action === "reject") {
    await admin
      .from("orders")
      .update({ status: "questionnaire" })
      .eq("id", orderId);

    // Reset questionnaire for re-fill
    await admin
      .from("questionnaires")
      .update({ status: "in_progress" })
      .eq("order_item_id", orderItems[0] && (orderItems[0] as unknown as { id: string }).id);

    await resend.emails.send({
      from: "Virtually Yours <noreply@virtually-yours.nl>",
      to: orderProfile.email,
      subject: `Actie vereist: ${docTitle}`,
      react: React.createElement(DocumentRejectedEmail, {
        firstName: orderProfile.first_name,
        docTitle,
        note,
        siteUrl: SITE_URL,
      }),
    });

    await admin.from("activity_log").insert({
      actor_id: user.id,
      action: "document_rejected",
      entity_type: "order",
      entity_id: orderId,
      metadata: { document: docTitle, reason: note },
    });
  } else if (action === "request_changes") {
    const orderItemId = (orderItems[0] as unknown as { id: string })?.id;

    // Update generated document status to rejected with reviewer notes
    if (orderItemId) {
      await admin
        .from("generated_documents")
        .update({ status: "rejected", reviewer_notes: note || null })
        .eq("order_item_id", orderItemId);
    }

    // Reset questionnaire to in_progress
    if (orderItemId) {
      await admin
        .from("questionnaires")
        .update({ status: "in_progress" })
        .eq("order_item_id", orderItemId);
    }

    // Set order status back to questionnaire
    await admin
      .from("orders")
      .update({ status: "questionnaire" })
      .eq("id", orderId);

    // Send email notification about requested changes
    await resend.emails.send({
      from: "Virtually Yours <noreply@virtually-yours.nl>",
      to: orderProfile.email,
      subject: `Wijzigingen gevraagd: ${docTitle}`,
      react: React.createElement(ChangesRequestedEmail, {
        firstName: orderProfile.first_name,
        docTitle,
        note,
        siteUrl: SITE_URL,
      }),
    });

    // Log the activity
    await admin.from("activity_log").insert({
      actor_id: user.id,
      action: "document_changes_requested",
      entity_type: "order",
      entity_id: orderId,
      metadata: { document: docTitle, reviewer_notes: note },
    });
  }

  return NextResponse.json({ success: true });
}
