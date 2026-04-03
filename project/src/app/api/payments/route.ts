import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
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

  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*, documents(title, slug))")
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

  // Create Stripe Checkout Session
  const stripe = getStripe();
  const lineItems = order.order_items.map((item: any) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.documents?.title || "Document",
      },
      unit_amount: item.price_cents,
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "ideal"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success&order=${orderId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?doc=${order.order_items[0]?.documents?.slug || ""}`,
    metadata: { orderId },
    customer_email: user.email,
  });

  // Store Stripe session ID on order (reusing mollie_payment_id column)
  await supabase
    .from("orders")
    .update({ mollie_payment_id: session.id })
    .eq("id", orderId);

  return NextResponse.json({ checkoutUrl: session.url });
}
