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
      return NextResponse.redirect(`${BASE_URL}/newsletter/expired`);
    }

    const locale = lead.locale || "nl";

    // Already confirmed
    if (lead.is_active && lead.confirmed_at) {
      return NextResponse.redirect(`${BASE_URL}/newsletter/confirmed`);
    }

    // Check expiry
    if (!lead.confirm_token_expires_at || new Date(lead.confirm_token_expires_at) < new Date()) {
      return NextResponse.redirect(`${BASE_URL}/newsletter/expired`);
    }

    // Activate the lead
    await db
      .from("newsletter_leads")
      .update({
        is_active: true,
        confirmed_at: new Date().toISOString(),
        confirm_token_expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lead.id);

    return NextResponse.redirect(`${BASE_URL}/newsletter/confirmed`);
  } catch (err) {
    console.error("[Newsletter Confirm] GET failed", err);
    return NextResponse.redirect(`${BASE_URL}/newsletter/expired`);
  }
}
