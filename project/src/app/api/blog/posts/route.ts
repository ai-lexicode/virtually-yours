import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const category = searchParams.get("category");
    const offset = (page - 1) * limit;

    const db = getPublicClient();
    let query = db
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image, published_at, category_id, meta_title, meta_description, blog_categories(name, slug)", { count: "exact" })
      .eq("status", "PUBLISHED");

    if (category) {
      // Filter by category slug via join
      query = query.eq("blog_categories.slug", category);
    }

    const { data: posts, count, error } = await query
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // If filtering by category, remove posts where category didn't match
    const filtered = category
      ? (posts || []).filter((p: Record<string, unknown>) => p.blog_categories !== null)
      : posts || [];

    return NextResponse.json({
      posts: filtered,
      total: category ? filtered.length : (count || 0),
      page,
      limit,
      totalPages: Math.ceil((category ? filtered.length : (count || 0)) / limit),
    });
  } catch (err) {
    console.error("[Blog Public] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
