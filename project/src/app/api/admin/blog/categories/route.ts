import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
});

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const db = getAdminClient();
    const { data: categories, error } = await db
      .from("blog_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json(categories || []);
  } catch (err) {
    console.error("[Blog Categories] GET failed", err);
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

    const db = getAdminClient();
    const { data: category, error } = await db
      .from("blog_categories")
      .insert(validation.data)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("[Blog Categories] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
