import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod/v4";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://virtually-yours.nl";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const newsletterSchema = z.object({
  email: z.string().trim().email().max(255),
  locale: z.enum(["nl", "en"]).optional().default("nl"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
    }

    const normalizedEmail = parsed.data.email.trim().toLowerCase();
    const locale = parsed.data.locale;
    const db = getServiceClient();

    // Check if user exists in profiles
    const { data: profile } = await db
      .from("profiles")
      .select("id")
      .eq("email", normalizedEmail)
      .single();

    if (profile) {
      // Registered user: upsert newsletter subscription
      const { data: existing } = await db
        .from("newsletter_subscriptions")
        .select("id")
        .eq("user_id", profile.id)
        .single();

      if (existing) {
        await db
          .from("newsletter_subscriptions")
          .update({ is_active: true, updated_at: new Date().toISOString() })
          .eq("user_id", profile.id);
      } else {
        await db
          .from("newsletter_subscriptions")
          .insert({ user_id: profile.id, is_active: true, general: true });
      }

      return NextResponse.json({ success: true, pending: false });
    }

    // Non-registered visitor: double opt-in flow
    const { data: existingLead } = await db
      .from("newsletter_leads")
      .select("is_active, confirmed_at")
      .eq("email", normalizedEmail)
      .single();

    if (existingLead?.is_active && existingLead?.confirmed_at) {
      // Already confirmed
      return NextResponse.json({ success: true, pending: false });
    }

    // Generate confirm token
    const confirmToken = crypto.randomUUID();
    const confirmTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await db
      .from("newsletter_leads")
      .upsert({
        email: normalizedEmail,
        source: "footer",
        is_active: false,
        locale,
        confirm_token: confirmToken,
        confirm_token_expires_at: confirmTokenExpiresAt,
      }, { onConflict: "email" });

    // Send confirmation email using Resend directly
    // (keeping it simple — no template dependency for feat-009)
    const confirmUrl = `${BASE_URL}/api/newsletter/confirm/${confirmToken}`;
    const { getResend, FROM } = await import("@/lib/resend");
    const resend = getResend();

    await resend.emails.send({
      from: FROM,
      to: normalizedEmail,
      subject: locale === "nl"
        ? "Bevestig uw nieuwsbrief aanmelding — Virtually Yours"
        : "Confirm your newsletter subscription — Virtually Yours",
      html: `<p>${locale === "nl" ? "Klik op de onderstaande link om uw aanmelding te bevestigen:" : "Click the link below to confirm your subscription:"}</p><p><a href="${confirmUrl}">${locale === "nl" ? "Bevestigen" : "Confirm"}</a></p>`,
    });

    return NextResponse.json({ success: true, pending: true });
  } catch (err) {
    console.error("[Newsletter Subscribe] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
