import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://virtually-yours.nl";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = getServiceClient();

    const { data: lead } = await db
      .from("newsletter_leads")
      .select("id, email, locale, is_active, confirmed_at, confirm_token_expires_at")
      .eq("confirm_token", token)
      .single();

    if (!lead) {
      return NextResponse.redirect(`${BASE_URL}/newsletter/bevestigd?status=expired`);
    }

    // Already confirmed
    if (lead.is_active && lead.confirmed_at) {
      return NextResponse.redirect(`${BASE_URL}/newsletter/bevestigd`);
    }

    // Check expiry
    if (!lead.confirm_token_expires_at || new Date(lead.confirm_token_expires_at) < new Date()) {
      return NextResponse.redirect(`${BASE_URL}/newsletter/bevestigd?status=expired`);
    }

    // Activate the lead and generate unsubscribe token
    const unsubscribeToken = crypto.randomUUID();
    await db
      .from("newsletter_leads")
      .update({
        is_active: true,
        confirmed_at: new Date().toISOString(),
        confirm_token_expires_at: null,
        unsubscribe_token: unsubscribeToken,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lead.id);

    // Send welcome email
    const { sendNewsletterWelcome } = await import("@/lib/resend");
    const unsubscribeUrl = `${BASE_URL}/newsletter/uitschrijven/${unsubscribeToken}`;
    await sendNewsletterWelcome(lead.email, unsubscribeUrl);

    return NextResponse.redirect(`${BASE_URL}/newsletter/bevestigd`);
  } catch (err) {
    console.error("[Newsletter Confirm] GET failed", err);
    return NextResponse.redirect(`${BASE_URL}/newsletter/bevestigd?status=expired`);
  }
}
