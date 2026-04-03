import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = getAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin" ? user : null;
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  const { id } = await params;

  // Prevent self-deletion
  if (id === user.id) {
    return NextResponse.json(
      { error: "U kunt uw eigen account niet verwijderen" },
      { status: 400 }
    );
  }

  const admin = getAdminClient();

  // Check user exists
  const { data: profile } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", id)
    .single();

  if (!profile) {
    return NextResponse.json(
      { error: "Gebruiker niet gevonden" },
      { status: 404 }
    );
  }

  // Delete from auth (cascades to profiles via trigger/FK)
  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) {
    return NextResponse.json(
      { error: "Verwijderen mislukt: " + error.message },
      { status: 500 }
    );
  }

  // Log the action
  await admin.from("activity_log").insert({
    actor_id: user.id,
    action: "user_deleted",
    entity_type: "profile",
    entity_id: id,
    metadata: { deleted_role: profile.role },
  });

  return NextResponse.json({ success: true });
}
