import { createMollieClient, type MollieClient } from "@mollie/api-client";

let _mollie: MollieClient | null = null;

export function getMollie(): MollieClient {
  if (!_mollie) {
    _mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });
  }
  return _mollie;
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
