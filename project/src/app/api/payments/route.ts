import { NextRequest, NextResponse } from "next/server";
import { getMollie } from "@/lib/mollie";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { orderId } = await request.json();

  // Fetch order
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*, documents(title))")
    .eq("id", orderId)
    .eq("profile_id", user.id)
    .single();

  if (error || !order) {
    return NextResponse.json(
      { error: "Bestelling niet gevonden" },
      { status: 404 }
    );
  }

  if (order.status !== "pending") {
    return NextResponse.json(
      { error: "Bestelling is al betaald" },
      { status: 400 }
    );
  }

  // Create Mollie payment
  const description = order.order_items
    .map((item: { documents: { title: string } }) => item.documents.title)
    .join(", ");

  const payment = await getMollie().payments.create({
    amount: {
      currency: "EUR",
      value: (order.total_cents / 100).toFixed(2),
    },
    description: `Virtually Yours #VY-${order.order_number} — ${description}`,
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success&order=${orderId}`,
    webhookUrl: `${process.env.MOLLIE_WEBHOOK_URL}`,
    metadata: { orderId },
  });

  // Store Mollie payment ID
  await supabase
    .from("orders")
    .update({ mollie_payment_id: payment.id })
    .eq("id", orderId);

  return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });
}
