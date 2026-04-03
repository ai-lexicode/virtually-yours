import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod/v4";
import { getRecipients } from "@/lib/newsletter/helpers";

const sendSchema = z.object({
  subject: z.string().min(1).max(200),
  content: z.array(z.object({
    id: z.string(),
    type: z.string(),
    props: z.record(z.string(), z.unknown()),
    order: z.number(),
  })),
  draftId: z.string().uuid().optional(),
  listType: z.enum(["general", "list"]),
  listId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = sendSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_BODY", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { subject, content, draftId, listType, listId } = validation.data;
    const recipients = await getRecipients(listType, listId);

    if (recipients.length === 0) {
      return NextResponse.json({ error: "NO_RECIPIENTS" }, { status: 400 });
    }

    const db = getAdminClient();
    let newsletterId: string;

    if (draftId) {
      const { error } = await db
        .from("newsletters")
        .update({
          subject,
          content,
          status: "sending",
          list_type: listType,
          list_id: listId || null,
          recipient_count: recipients.length,
          updated_at: new Date().toISOString(),
        })
        .eq("id", draftId);

      if (error) throw error;
      newsletterId = draftId;
    } else {
      const { data: nl, error } = await db
        .from("newsletters")
        .insert({
          subject,
          content,
          status: "sending",
          list_type: listType,
          list_id: listId || null,
          sent_by: auth.user.id,
          recipient_count: recipients.length,
        })
        .select("id")
        .single();

      if (error) throw error;
      newsletterId = nl!.id;
    }

    // Create recipient records
    const { error: recError } = await db
      .from("newsletter_recipients")
      .insert(
        recipients.map((r) => ({
          newsletter_id: newsletterId,
          email: r.email,
          user_id: r.userId || null,
          status: "queued",
        }))
      );

    if (recError) throw recError;

    return NextResponse.json({ success: true, newsletterId, recipientCount: recipients.length });
  } catch (err) {
    console.error("[Newsletter Send] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
