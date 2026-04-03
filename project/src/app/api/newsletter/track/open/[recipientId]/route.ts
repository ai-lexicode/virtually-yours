import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Smallest valid transparent 1x1 GIF (43 bytes)
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ recipientId: string }> }
) {
  const { recipientId } = await params;

  try {
    const db = getServiceClient();
    const { data: recipient } = await db
      .from("newsletter_recipients")
      .select("id, status, opened_at")
      .eq("id", recipientId)
      .single();

    if (recipient && !recipient.opened_at) {
      const shouldUpdate = recipient.status !== "clicked" && recipient.status !== "complained";
      if (shouldUpdate) {
        await db
          .from("newsletter_recipients")
          .update({ opened_at: new Date().toISOString(), status: "opened" })
          .eq("id", recipientId);
      }
    }
  } catch (err) {
    console.warn("[Newsletter Track Open] Failed", { recipientId, err });
  }

  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
