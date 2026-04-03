import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return _stripe;
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function calculateBtw(
  priceCents: number,
  btwPercentage: number = 21
): number {
  return Math.round(priceCents - priceCents / (1 + btwPercentage / 100));
}
