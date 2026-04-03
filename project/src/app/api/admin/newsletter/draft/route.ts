import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod";

const draftSchema = z.object({
  id: z.string().uuid().optional(),
  subject: z.string().min(1).max(200),
  content: z.array(z.object({
    id: z.string(),
    type: z.string(),
    props: z.record(z.string(), z.unknown()),
    order: z.number(),
  })),
  listType: z.enum(["general", "list"]).default("general"),
  listId: z.string().uuid().optional(),
});

// Save or update a draft
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = draftSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_BODY", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { id, subject, content, listType, listId } = validation.data;
    const db = getAdminClient();

    if (id) {
      // Update existing draft
      const { data: existing } = await db
        .from("newsletters")
        .select("id, status")
        .eq("id", id)
        .single();

      if (!existing || existing.status !== "draft") {
        return NextResponse.json({ error: "DRAFT_NOT_FOUND" }, { status: 404 });
      }

      const { data: updated, error } = await db
        .from("newsletters")
        .update({
          subject,
          content,
          list_type: listType,
          list_id: listId || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, draft: updated });
    }

    // Create new draft
    const { data: draft, error } = await db
      .from("newsletters")
      .insert({
        subject,
        content,
        status: "draft",
        list_type: listType,
        list_id: listId || null,
        sent_by: auth.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, draft });
  } catch (err) {
    console.error("[Newsletter Draft] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

// List drafts or get single draft
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const db = getAdminClient();

    if (id) {
      const { data: draft } = await db
        .from("newsletters")
        .select("*")
        .eq("id", id)
        .eq("status", "draft")
        .single();

      if (!draft) {
        return NextResponse.json({ error: "DRAFT_NOT_FOUND" }, { status: 404 });
      }
      return NextResponse.json({ draft });
    }

    const { data: drafts } = await db
      .from("newsletters")
      .select("id, subject, list_type, created_at, updated_at")
      .eq("status", "draft")
      .order("created_at", { ascending: false });

    return NextResponse.json({ drafts: drafts || [] });
  } catch (err) {
    console.error("[Newsletter Draft] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

// Delete a draft
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });
    }

    const db = getAdminClient();
    const { data: existing } = await db
      .from("newsletters")
      .select("id, status")
      .eq("id", id)
      .single();

    if (!existing || existing.status !== "draft") {
      return NextResponse.json({ error: "DRAFT_NOT_FOUND" }, { status: 404 });
    }

    const { error } = await db
      .from("newsletters")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Newsletter Draft] DELETE failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
