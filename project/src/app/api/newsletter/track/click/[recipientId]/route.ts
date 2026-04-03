import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recipientId: string }> }
) {
  const { recipientId } = await params;
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const decoded = decodeURIComponent(url);
    const db = getServiceClient();

    const { data: recipient } = await db
      .from("newsletter_recipients")
      .select("id, status")
      .eq("id", recipientId)
      .single();

    if (recipient) {
      // Record the click
      await db.from("newsletter_clicks").insert({
        recipient_id: recipientId,
        original_url: decoded,
      });

      // Update status if not bounced/complained
      if (recipient.status !== "bounced" && recipient.status !== "complained") {
        await db
          .from("newsletter_recipients")
          .update({ clicked_at: new Date().toISOString(), status: "clicked" })
          .eq("id", recipientId);
      }
    }

    return NextResponse.redirect(decoded, 302);
  } catch (err) {
    console.warn("[Newsletter Track Click] Failed", { recipientId, err });
    try {
      return NextResponse.redirect(decodeURIComponent(url), 302);
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
