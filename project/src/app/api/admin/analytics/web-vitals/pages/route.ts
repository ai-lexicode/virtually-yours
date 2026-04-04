import { NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { getPagePerformance } from "@/lib/services/web-vitals-service";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const db = getAdminClient();
  const pages = await getPagePerformance(db);

  return NextResponse.json({ pages });
}
