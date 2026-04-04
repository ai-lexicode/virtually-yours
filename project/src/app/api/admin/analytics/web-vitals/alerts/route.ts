import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { getAlerts } from "@/lib/services/web-vitals-service";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const db = getAdminClient();
  const alerts = await getAlerts(db);

  return NextResponse.json({ alerts });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await request.json();
  const { id } = body;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing alert id" }, { status: 400 });
  }

  const db = getAdminClient();
  const { error } = await db
    .from("web_vital_alerts")
    .update({ resolved: true, resolved_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
