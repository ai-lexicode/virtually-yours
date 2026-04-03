import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { z } from "zod/v4";

function getServiceDb() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const preferencesSchema = z.object({
  isActive: z.boolean(),
  general: z.boolean(),
});

/**
 * GET /api/newsletter/preferences
 * Retrieve newsletter preferences for the authenticated user
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const db = getServiceDb();
    const { data: subscription } = await db
      .from("newsletter_subscriptions")
      .select("is_active, general")
      .eq("user_id", user.id)
      .single();

    if (!subscription) {
      return NextResponse.json({ isActive: false, general: true });
    }

    return NextResponse.json({
      isActive: subscription.is_active,
      general: subscription.general,
    });
  } catch (err) {
    console.error("[Newsletter Preferences] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

/**
 * PUT /api/newsletter/preferences
 * Update newsletter preferences for the authenticated user
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = preferencesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { isActive, general } = parsed.data;
    const db = getServiceDb();

    // Upsert
    const { data: existing } = await db
      .from("newsletter_subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      await db
        .from("newsletter_subscriptions")
        .update({
          is_active: isActive,
          general,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    } else {
      await db
        .from("newsletter_subscriptions")
        .insert({
          user_id: user.id,
          is_active: isActive,
          general,
        });
    }

    return NextResponse.json({ isActive, general });
  } catch (err) {
    console.error("[Newsletter Preferences] PUT failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
