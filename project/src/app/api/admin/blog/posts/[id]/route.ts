import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  slug: z.string().min(1).max(300).regex(/^[a-z0-9-]+$/).optional(),
  content: z.string().optional(),
  excerpt: z.string().max(500).optional().nullable(),
  cover_image: z.string().url().optional().or(z.literal("")).nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  published_at: z.string().datetime().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  meta_title: z.string().max(200).optional().nullable(),
  meta_description: z.string().max(500).optional().nullable(),
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
    const { data: post, error } = await db
      .from("blog_posts")
      .select("*, blog_categories(name, slug)")
      .eq("id", id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (err) {
    console.error("[Blog Posts] GET by id failed", err);
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

    const data = { ...validation.data };

    // Auto-set published_at when publishing for the first time
    if (data.status === "PUBLISHED" && !data.published_at) {
      const db = getAdminClient();
      const { data: existing } = await db
        .from("blog_posts")
        .select("published_at")
        .eq("id", id)
        .single();
      if (!existing?.published_at) {
        data.published_at = new Date().toISOString();
      }
    }

    const db = getAdminClient();
    const { data: post, error } = await db
      .from("blog_posts")
      .update(data)
      .eq("id", id)
      .select("*, blog_categories(name, slug)")
      .single();

    if (error || !post) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (err) {
    console.error("[Blog Posts] PUT failed", err);
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
    const { error } = await db.from("blog_posts").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Blog Posts] DELETE failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
