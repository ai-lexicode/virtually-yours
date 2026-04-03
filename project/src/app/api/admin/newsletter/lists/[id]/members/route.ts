import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { z } from "zod/v4";

const addMemberSchema = z.object({
  userId: z.string().uuid().optional(),
  leadId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).check(
  (ctx) => {
    if (!ctx.value.userId && !ctx.value.leadId && !ctx.value.email) {
      ctx.issues.push({
        code: "custom",
        message: "Either userId, leadId, or email is required",
        path: [],
      });
    }
  }
);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const db = getAdminClient();

    const { data: members, error } = await db
      .from("newsletter_list_members")
      .select("id, user_id, lead_id, added_at, profiles(id, email, first_name, last_name), newsletter_leads(id, email, first_name, last_name)")
      .eq("list_id", id)
      .order("added_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(
      (members || []).map((m) => {
        const profile = m.profiles as unknown as { id: string; email: string; first_name: string; last_name: string } | null;
        const lead = m.newsletter_leads as unknown as { id: string; email: string; first_name: string; last_name: string } | null;
        return {
          id: m.id,
          type: m.user_id ? "user" : "lead",
          email: profile?.email || lead?.email || "",
          firstName: profile?.first_name || lead?.first_name || "",
          lastName: profile?.last_name || lead?.last_name || "",
          addedAt: m.added_at,
        };
      })
    );
  } catch (err) {
    console.error("[Newsletter Members] GET failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const validation = addMemberSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_BODY", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const db = getAdminClient();

    // Check list exists
    const { data: list } = await db
      .from("newsletter_lists")
      .select("id")
      .eq("id", id)
      .single();
    if (!list) {
      return NextResponse.json({ error: "LIST_NOT_FOUND" }, { status: 404 });
    }

    let userId = validation.data.userId || null;
    let leadId = validation.data.leadId || null;
    const { email, firstName, lastName } = validation.data;

    // Resolve email to userId or leadId
    if (email && !userId && !leadId) {
      const { data: existingUser } = await db
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const { data: existingLead } = await db
          .from("newsletter_leads")
          .select("id")
          .eq("email", email)
          .single();

        if (existingLead) {
          leadId = existingLead.id;
        } else {
          // Create new lead
          const { data: newLead, error: leadError } = await db
            .from("newsletter_leads")
            .insert({
              email,
              first_name: firstName || null,
              last_name: lastName || null,
              source: "manual",
              is_active: true,
            })
            .select("id")
            .single();

          if (leadError) throw leadError;
          leadId = newLead!.id;
        }
      }
    }

    // Check for duplicate
    if (userId) {
      const { data: existing } = await db
        .from("newsletter_list_members")
        .select("id")
        .eq("list_id", id)
        .eq("user_id", userId)
        .single();
      if (existing) {
        return NextResponse.json({ error: "ALREADY_MEMBER" }, { status: 409 });
      }
    }
    if (leadId) {
      const { data: existing } = await db
        .from("newsletter_list_members")
        .select("id")
        .eq("list_id", id)
        .eq("lead_id", leadId)
        .single();
      if (existing) {
        return NextResponse.json({ error: "ALREADY_MEMBER" }, { status: 409 });
      }
    }

    const { data: member, error } = await db
      .from("newsletter_list_members")
      .insert({ list_id: id, user_id: userId, lead_id: leadId })
      .select("id, user_id, lead_id, added_at, profiles(id, email, first_name, last_name), newsletter_leads(id, email, first_name, last_name)")
      .single();

    if (error) throw error;

    const profile = member!.profiles as unknown as { id: string; email: string; first_name: string; last_name: string } | null;
    const lead = member!.newsletter_leads as unknown as { id: string; email: string; first_name: string; last_name: string } | null;

    return NextResponse.json({
      id: member!.id,
      type: member!.user_id ? "user" : "lead",
      email: profile?.email || lead?.email || "",
      firstName: profile?.first_name || lead?.first_name || "",
      lastName: profile?.last_name || lead?.last_name || "",
      addedAt: member!.added_at,
    }, { status: 201 });
  } catch (err) {
    console.error("[Newsletter Members] POST failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json({ error: "MEMBER_ID_REQUIRED" }, { status: 400 });
    }

    const db = getAdminClient();
    const { data: member } = await db
      .from("newsletter_list_members")
      .select("id")
      .eq("id", memberId)
      .eq("list_id", id)
      .single();

    if (!member) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const { error } = await db
      .from("newsletter_list_members")
      .delete()
      .eq("id", memberId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Newsletter Members] DELETE failed", err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
