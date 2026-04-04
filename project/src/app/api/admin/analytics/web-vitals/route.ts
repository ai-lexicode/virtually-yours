import { NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import {
  getAggregatedMetrics,
  checkAndCreateAlerts,
} from "@/lib/services/web-vitals-service";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const db = getAdminClient();

  // Trigger alert check on each view
  try {
    await checkAndCreateAlerts(db);
  } catch (e) {
    console.warn("[web-vitals] Alert check failed:", e);
  }

  const metrics = await getAggregatedMetrics(db);

  return NextResponse.json({ metrics });
}
