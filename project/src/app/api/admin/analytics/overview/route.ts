import { NextResponse } from "next/server";
import { requireAdmin, getAdminClient } from "@/lib/admin";
import { getStripe, formatPrice } from "@/lib/stripe";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const db = getAdminClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Revenue from Stripe (handle gracefully if not configured)
  let revenue = 0;
  let revenueFormatted = formatPrice(0);
  try {
    const stripe = getStripe();
    const charges = await stripe.charges.list({
      created: { gte: Math.floor(thirtyDaysAgo.getTime() / 1000) },
      limit: 100,
    });
    revenue = charges.data
      .filter((c) => c.paid && !c.refunded)
      .reduce((sum, c) => sum + c.amount, 0);
    revenueFormatted = formatPrice(revenue);
  } catch (e) {
    console.warn("[analytics/overview] Stripe error:", e);
    revenueFormatted = formatPrice(0);
  }

  // Active customers (profiles active in last 30 days)
  const { count: activeCustomers } = await db
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("updated_at", thirtyDaysAgo.toISOString());

  // Orders in last 30 days
  const { count: orderCount } = await db
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo.toISOString());

  // Document completion rate
  const { count: totalDocs } = await db
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo.toISOString());

  const { count: completedDocs } = await db
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo.toISOString())
    .eq("status", "completed");

  const completionRate =
    totalDocs && totalDocs > 0
      ? Math.round(((completedDocs ?? 0) / totalDocs) * 100)
      : 0;

  return NextResponse.json({
    revenue: { cents: revenue, formatted: revenueFormatted },
    activeCustomers: activeCustomers ?? 0,
    orders: orderCount ?? 0,
    completionRate,
  });
}
