import { NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { getDailyTrends } from "@/lib/services/web-vitals-service";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const db = getAdminClient();
  const trends = await getDailyTrends(db);

  return NextResponse.json({ trends });
}
