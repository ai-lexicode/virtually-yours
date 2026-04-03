import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateBtw } from "@/lib/stripe";
import { z } from "zod";

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        documentId: z.string().uuid().optional(),
        bundleId: z.string().uuid().optional(),
      })
    )
    .min(1)
    .max(50),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ongeldige invoer", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { items } = parsed.data;

  // Collect prices for all items
  let totalCents = 0;
  const resolvedItems: { documentId?: string; bundleId?: string; priceCents: number; btwCents: number }[] = [];

  for (const item of items) {
    if (item.documentId) {
      const { data: doc } = await supabase
        .from("documents")
        .select("id, price_cents")
        .eq("id", item.documentId)
        .single();

      if (!doc) {
        return NextResponse.json(
          { error: "Document niet gevonden" },
          { status: 404 }
        );
      }

      const btwCents = calculateBtw(doc.price_cents);
      resolvedItems.push({
        documentId: doc.id,
        priceCents: doc.price_cents,
        btwCents,
      });
      totalCents += doc.price_cents;
    } else if (item.bundleId) {
      const { data: bundle } = await supabase
        .from("bundles")
        .select("id, price_cents")
        .eq("id", item.bundleId)
        .single();

      if (!bundle) {
        return NextResponse.json(
          { error: "Pakket niet gevonden" },
          { status: 404 }
        );
      }

      const btwCents = calculateBtw(bundle.price_cents);
      resolvedItems.push({
        bundleId: bundle.id,
        priceCents: bundle.price_cents,
        btwCents,
      });
      totalCents += bundle.price_cents;
    }
  }

  const totalBtw = calculateBtw(totalCents);
  const subtotal = totalCents - totalBtw;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      profile_id: user.id,
      subtotal_cents: subtotal,
      btw_cents: totalBtw,
      total_cents: totalCents,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Bestelling kon niet worden aangemaakt" },
      { status: 500 }
    );
  }

  // Create order items
  const orderItems = resolvedItems.map((ri) => ({
    order_id: order.id,
    document_id: ri.documentId ?? null,
    bundle_id: ri.bundleId ?? null,
    price_cents: ri.priceCents,
    btw_cents: ri.btwCents,
  }));

  await supabase.from("order_items").insert(orderItems);

  // Log activity
  await supabase.from("activity_log").insert({
    actor_id: user.id,
    action: "order_created",
    entity_type: "order",
    entity_id: order.id,
    metadata: { order_number: order.order_number },
  });

  return NextResponse.json({ orderId: order.id, orderNumber: order.order_number });
}
