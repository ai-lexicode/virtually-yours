import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod/v4";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const unsubscribeSchema = z.object({
  unsubscribeAll: z.boolean().optional(),
});

/**
 * GET /api/newsletter/unsubscribe/[token]
 * Retrieve current subscription status by unsubscribe token
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = getServiceClient();

    const { data: subscription } = await db
      .from("newsletter_subscriptions")
      .select("is_active, general")
      .eq("unsubscribe_token", token)
      .single();

    if (subscription) {
      return NextResponse.json({ ...subscription, type: "user" });
    }

    const { data: lead } = await db
      .from("newsletter_leads")
      .select("is_active")
      .eq("unsubscribe_token", token)
      .single();

    if (lead) {
      return NextResponse.json({ isActive: lead.is_active, type: "lead" });
    }

    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  } catch (err) {
    console.error("[Newsletter Unsubscribe] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

/**
 * POST /api/newsletter/unsubscribe/[token]
 * Unsubscribe from newsletter (token acts as auth)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = getServiceClient();

    const body = await request.json();
    const parsed = unsubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "VALIDATION_ERROR" }, { status: 400 });
    }

    // Try subscription first
    const { data: subscription } = await db
      .from("newsletter_subscriptions")
      .select("id")
      .eq("unsubscribe_token", token)
      .single();

    if (subscription) {
      await db
        .from("newsletter_subscriptions")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("unsubscribe_token", token);
      return NextResponse.json({ success: true });
    }

    // Fallback: check lead
    const { data: lead } = await db
      .from("newsletter_leads")
      .select("id")
      .eq("unsubscribe_token", token)
      .single();

    if (lead) {
      await db
        .from("newsletter_leads")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("unsubscribe_token", token);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  } catch (err) {
    console.error("[Newsletter Unsubscribe] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
