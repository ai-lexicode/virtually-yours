import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(300).regex(/^[a-z0-9-]+$/),
  content: z.string().default(""),
  excerpt: z.string().max(500).optional(),
  cover_image: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  published_at: z.string().datetime().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  meta_title: z.string().max(200).optional(),
  meta_description: z.string().max(500).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const offset = (page - 1) * limit;

    const db = getAdminClient();
    let query = db
      .from("blog_posts")
      .select("*, blog_categories(name, slug)", { count: "exact" });

    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category_id", category);
    if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);

    const { data: posts, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      posts: posts || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    console.error("[Blog Posts] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = createSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_BODY", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = {
      ...validation.data,
      author_id: auth.user.id,
      published_at:
        validation.data.status === "PUBLISHED" && !validation.data.published_at
          ? new Date().toISOString()
          : validation.data.published_at || null,
    };

    const db = getAdminClient();
    const { data: post, error } = await db
      .from("blog_posts")
      .insert(data)
      .select("*, blog_categories(name, slug)")
      .single();

    if (error) throw error;

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("[Blog Posts] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
