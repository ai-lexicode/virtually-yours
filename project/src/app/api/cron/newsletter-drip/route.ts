import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getResend, FROM, SITE_URL } from "@/lib/resend";
import { Resend } from "resend";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  // Authenticate with CRON_SECRET
  const secret = request.headers
    .get("authorization")
    ?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getServiceClient();
  const resend = getResend();
  const results = { welcome: 0, re_engagement: 0, errors: 0 };

  try {
    // Get all active sequences
    const { data: sequences } = await db
      .from("newsletter_drip_sequences")
      .select("*, newsletter_drip_steps(*)")
      .eq("is_active", true)
      .order("created_at");

    if (!sequences || sequences.length === 0) {
      return NextResponse.json({ message: "No active sequences", results });
    }

    for (const seq of sequences) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const steps = ((seq as any).newsletter_drip_steps || []).sort(
        (a: { step_order: number }, b: { step_order: number }) =>
          a.step_order - b.step_order
      ) as Step[];
      if (steps.length === 0) continue;

      if ((seq as Record<string, unknown>).trigger_type === "welcome") {
        await processWelcomeDrip(db, resend, steps, results);
      } else if ((seq as Record<string, unknown>).trigger_type === "re_engagement") {
        await processReEngagementDrip(db, resend, steps, results);
      }
    }

    return NextResponse.json({ message: "Drip processing complete", results });
  } catch (err) {
    console.error("[Drip Cron] Failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

interface Step {
  id: string;
  delay_days: number;
  subject: string;
  content: string;
  step_order: number;
}

interface Lead {
  id: string;
  email: string;
  confirmed_at: string;
  unsubscribe_token: string;
}

type DB = ReturnType<typeof getServiceClient>;

async function processWelcomeDrip(
  db: DB,
  resend: Resend,
  steps: Step[],
  results: { welcome: number; re_engagement: number; errors: number }
) {
  // Find confirmed, active leads that haven't unsubscribed
  const { data } = await db
    .from("newsletter_leads")
    .select("id, email, confirmed_at, unsubscribe_token")
    .eq("is_active", true)
    .not("confirmed_at", "is", null)
    .is("unsubscribed_at", null);

  const leads = (data || []) as unknown as Lead[];
  if (leads.length === 0) return;

  for (const lead of leads) {
    const confirmedAt = new Date(lead.confirmed_at);

    for (const step of steps) {
      // Check if already sent
      const { data: existing } = await db
        .from("newsletter_drip_sends")
        .select("id")
        .eq("step_id", step.id)
        .eq("subscriber_email", lead.email)
        .limit(1);

      if (existing && existing.length > 0) continue;

      // Check if step is due (confirmed_at + delay_days <= now)
      const dueDate = new Date(confirmedAt);
      dueDate.setDate(dueDate.getDate() + step.delay_days);

      if (dueDate > new Date()) continue;

      // Send the drip email
      await sendDripEmail(db, resend, step, lead, results, "welcome");
    }
  }
}

async function processReEngagementDrip(
  db: DB,
  resend: Resend,
  steps: Step[],
  results: { welcome: number; re_engagement: number; errors: number }
) {
  // Find active leads who haven't unsubscribed
  const { data } = await db
    .from("newsletter_leads")
    .select("id, email, confirmed_at, unsubscribe_token")
    .eq("is_active", true)
    .not("confirmed_at", "is", null)
    .is("unsubscribed_at", null);

  const leads = (data || []) as unknown as Lead[];
  if (leads.length === 0) return;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  for (const lead of leads) {
    // Check last open date from newsletter_recipients
    const { data: lastOpenData } = await db
      .from("newsletter_recipients")
      .select("opened_at")
      .eq("email", lead.email)
      .not("opened_at", "is", null)
      .order("opened_at", { ascending: false })
      .limit(1);

    const lastOpen = (lastOpenData || []) as unknown as Array<{ opened_at: string }>;

    // If they've opened recently, skip
    if (lastOpen.length > 0) {
      const lastOpenDate = new Date(lastOpen[0].opened_at);
      if (lastOpenDate > thirtyDaysAgo) continue;
    }

    // Check if they already have any drip sends for this sequence's steps
    const stepIds = steps.map((s) => s.id);
    const { data: existingSendsData } = await db
      .from("newsletter_drip_sends")
      .select("step_id")
      .eq("subscriber_email", lead.email)
      .in("step_id", stepIds);

    const existingSends = (existingSendsData || []) as unknown as Array<{ step_id: string }>;
    const sentStepIds = new Set(existingSends.map((s) => s.step_id));

    // Find the first unsent step
    const nextStep = steps.find((s) => !sentStepIds.has(s.id));
    if (!nextStep) continue;

    // For re-engagement, use the first unsent step's delay relative to when they became inactive
    const baseline = lastOpen.length > 0
      ? new Date(lastOpen[0].opened_at)
      : new Date(lead.confirmed_at);

    const dueDate = new Date(baseline);
    dueDate.setDate(dueDate.getDate() + 30 + nextStep.delay_days);

    if (dueDate > new Date()) continue;

    await sendDripEmail(db, resend, nextStep, lead, results, "re_engagement");
  }
}

async function sendDripEmail(
  db: DB,
  resend: Resend,
  step: Step,
  lead: Lead,
  results: { welcome: number; re_engagement: number; errors: number },
  type: "welcome" | "re_engagement"
) {
  try {
    // Create send record with 'sending' status
    const { data: sendRecord } = await db
      .from("newsletter_drip_sends")
      .insert({
        step_id: step.id,
        subscriber_email: lead.email,
        status: "sending",
      })
      .select("id")
      .single();

    if (!sendRecord) return;

    const unsubscribeUrl = lead.unsubscribe_token
      ? `${SITE_URL}/newsletter/uitschrijven/${lead.unsubscribe_token}`
      : undefined;

    // Build email HTML with content + unsubscribe footer
    const html = buildDripHtml(step.content, unsubscribeUrl);

    await resend.emails.send({
      from: FROM,
      to: lead.email,
      subject: step.subject,
      html,
    });

    // Update to sent
    await db
      .from("newsletter_drip_sends")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", (sendRecord as { id: string }).id);

    results[type]++;
  } catch (err) {
    console.error(`[Drip Cron] Send failed for ${lead.email}`, err);
    results.errors++;

    // Try to mark as failed if we have the record
    await db
      .from("newsletter_drip_sends")
      .update({ status: "failed" })
      .eq("step_id", step.id)
      .eq("subscriber_email", lead.email)
      .eq("status", "sending");
  }
}

function buildDripHtml(content: string, unsubscribeUrl?: string): string {
  const footer = unsubscribeUrl
    ? `<br/><hr style="margin-top:32px;border:none;border-top:1px solid #e5e5e5"/><p style="font-size:12px;color:#888;margin-top:16px">U ontvangt deze e-mail omdat u zich heeft aangemeld voor de Virtually Yours newsletter. <a href="${unsubscribeUrl}" style="color:#888">Uitschrijven</a></p>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333">
${content}
${footer}
</body>
</html>`;
}
