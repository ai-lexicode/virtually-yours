import { NextRequest, NextResponse } from "next/server";
import { getMollie } from "@/lib/mollie";
import { createServerClient } from "@supabase/ssr";
import { sendPaymentConfirmation } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const paymentId = body.get("id") as string;

    if (!paymentId) {
      return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
    }

    // Validate paymentId format (Mollie uses tr_ prefix + alphanumeric)
    if (!/^tr_[a-zA-Z0-9]+$/.test(paymentId)) {
      return NextResponse.json({ error: "Invalid payment ID format" }, { status: 400 });
    }

    // Verify payment with Mollie (recommended approach — Mollie doesn't sign webhooks)
    const payment = await getMollie().payments.get(paymentId);

    if (payment.status !== "paid") {
      return NextResponse.json({ status: payment.status });
    }

    // Validate metadata contains orderId
    const metadata = payment.metadata as { orderId?: string } | null;
    if (!metadata?.orderId) {
      console.error(`Webhook: payment ${paymentId} has no orderId in metadata`);
      return NextResponse.json({ error: "Missing order metadata" }, { status: 400 });
    }

    const { orderId } = metadata;

    // Use service role for webhook (no user context)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    // Verify the order exists before processing
    const { data: existingOrder, error: orderError } = await supabase
      .from("orders")
      .select("id, mollie_payment_id")
      .eq("id", orderId)
      .single();

    if (orderError || !existingOrder) {
      console.error(`Webhook: order ${orderId} not found for payment ${paymentId}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Prevent replay attacks: ensure the payment belongs to this order
    if (existingOrder.mollie_payment_id && existingOrder.mollie_payment_id !== paymentId) {
      console.error(
        `Webhook: payment ID mismatch for order ${orderId} — ` +
        `expected ${existingOrder.mollie_payment_id}, got ${paymentId}`
      );
      return NextResponse.json({ error: "Payment ID mismatch" }, { status: 403 });
    }

    // Update order status
    await supabase
      .from("orders")
      .update({
        status: "questionnaire",
        payment_method: String(payment.method),
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    // Create questionnaire records for each order item
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("id, documents(docassemble_interview_id)")
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

      await sendPaymentConfirmation(
        profile.email,
        order.order_number,
        docTitles
      );
    }

    // Log activity
    await supabase.from("activity_log").insert({
      action: "payment_received",
      entity_type: "order",
      entity_id: orderId,
      metadata: {
        payment_method: payment.method,
        amount: payment.amount.value,
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
