import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod/v4";

const MAX_CHUNK_SIZE = 200;

const importSchema = z.object({
  mappedData: z.array(
    z.object({
      email: z.string().email(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    })
  ),
  listId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await request.json();
    const validation = importSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_BODY", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { mappedData, listId } = validation.data;

    if (mappedData.length > MAX_CHUNK_SIZE) {
      return NextResponse.json(
        { error: "CHUNK_TOO_LARGE", max: MAX_CHUNK_SIZE },
        { status: 400 }
      );
    }

    const db = getAdminClient();
    let imported = 0;
    let duplicates = 0;
    const errors: Array<{ row: number; reason: string }> = [];

    const emails = mappedData.map((r) => r.email.toLowerCase());

    // Pre-fetch existing users and leads in bulk
    const [{ data: existingUsers }, { data: existingLeads }] = await Promise.all([
      db.from("profiles").select("id, email").in("email", emails),
      db.from("newsletter_leads").select("id, email").in("email", emails),
    ]);

    const userMap = new Map((existingUsers || []).map((u) => [u.email, u.id]));
    const leadMap = new Map((existingLeads || []).map((l) => [l.email, l.id]));

    const userEmails: string[] = [];
    const existingLeadEmails: string[] = [];
    const newLeadRows: typeof mappedData = [];

    for (let i = 0; i < mappedData.length; i++) {
      const row = mappedData[i];
      const email = row.email.toLowerCase();
      if (userMap.has(email)) {
        userEmails.push(email);
        imported++;
      } else if (leadMap.has(email)) {
        existingLeadEmails.push(email);
        duplicates++;
      } else {
        newLeadRows.push({ ...row, email });
        imported++;
      }
    }

    // Upsert subscriptions for existing users
    for (const email of userEmails) {
      const userId = userMap.get(email)!;
      const { data: existing } = await db
        .from("newsletter_subscriptions")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (existing) {
        // Already has subscription, skip
      } else {
        await db.from("newsletter_subscriptions").insert({
          user_id: userId,
          is_active: true,
          general: true,
        });
      }
    }

    // Bulk create new leads
    if (newLeadRows.length > 0) {
      const { error: leadError } = await db
        .from("newsletter_leads")
        .upsert(
          newLeadRows.map((row) => ({
            email: row.email,
            first_name: row.firstName || null,
            last_name: row.lastName || null,
            source: "import",
            is_active: true,
            confirmed_at: new Date().toISOString(),
          })),
          { onConflict: "email" }
        );

      if (leadError) {
        console.error("[Newsletter Import] Lead creation failed", leadError);
      }
    }

    // Add list members if listId specified
    if (listId) {
      // Re-fetch newly created leads
      const newEmails = newLeadRows.map((r) => r.email);
      const allLeadEmails = [...existingLeadEmails, ...newEmails];

      if (allLeadEmails.length > 0) {
        const { data: freshLeads } = await db
          .from("newsletter_leads")
          .select("id, email")
          .in("email", allLeadEmails);

        const freshLeadMap = new Map((freshLeads || []).map((l) => [l.email, l.id]));

        // Create list members for leads
        const leadMembers = allLeadEmails
          .filter((email) => freshLeadMap.has(email))
          .map((email) => ({ list_id: listId, lead_id: freshLeadMap.get(email)! }));

        if (leadMembers.length > 0) {
          await db
            .from("newsletter_list_members")
            .upsert(leadMembers, { onConflict: "list_id,lead_id" });
        }
      }

      // Create list members for users
      const userMembers = userEmails
        .filter((email) => userMap.has(email))
        .map((email) => ({ list_id: listId, user_id: userMap.get(email)! }));

      if (userMembers.length > 0) {
        await db
          .from("newsletter_list_members")
          .upsert(userMembers, { onConflict: "list_id,user_id" });
      }
    }

    return NextResponse.json({ imported, duplicates, errors });
  } catch (err) {
    console.error("[Newsletter Import] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
