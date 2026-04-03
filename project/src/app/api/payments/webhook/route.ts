import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";
import { sendPaymentConfirmation } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const stripe = getStripe();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("Webhook: no orderId in session metadata");
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    // Verify order exists
    const { data: existingOrder, error: orderError } = await supabase
      .from("orders")
      .select("id, status, mollie_payment_id")
      .eq("id", orderId)
      .single();

    if (orderError || !existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Already processed
    if (existingOrder.status !== "pending") {
      return NextResponse.json({ status: "already_processed" });
    }

    // Update order
    await supabase
      .from("orders")
      .update({
        status: "questionnaire",
        payment_method: session.payment_method_types?.[0] || "card",
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    // Create questionnaire records
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("id")
      .eq("order_id", orderId);

    if (orderItems) {
      for (const item of orderItems) {
        await supabase.from("questionnaires").insert({
          order_item_id: item.id,
          status: "not_started",
        });
      }
    }

    // Create invoice
    await supabase.from("invoices").insert({ order_id: orderId });

    // Send confirmation email
    const { data: order } = await supabase
      .from("orders")
      .select("order_number, profiles!inner(email), order_items(documents(title))")
      .eq("id", orderId)
      .single();

    if (order) {
      const profile = order.profiles as unknown as { email: string };
      const docTitles = (order.order_items as unknown as { documents: { title: string } }[])
        .map((i) => i.documents.title)
        .join(", ");
      await sendPaymentConfirmation(profile.email, order.order_number, docTitles);
    }

    // Log activity
    await supabase.from("activity_log").insert({
      action: "payment_received",
      entity_type: "order",
      entity_id: orderId,
      metadata: {
        payment_method: session.payment_method_types?.[0],
        amount: session.amount_total,
        stripe_session_id: session.id,
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
