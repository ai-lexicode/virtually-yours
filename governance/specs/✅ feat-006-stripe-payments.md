---
spec: feat-006
type: feature
status: implemented
title: Stripe Checkout als betalingsgateway (vervangt Mollie)
created: 2026-04-03
approved: 2026-04-03T02:30
priority: high
size: medium
preflight: 2026-04-03T02:30
preflight_rounds: 1
preflight_verdict: pass
ship: direct
---

# feat-006: Stripe Checkout (vervangt Mollie)

## Doel

Vervang Mollie door Stripe Checkout (hosted) als betalingsgateway. Ondersteunt kaartbetalingen (Visa, Mastercard) en iDEAL. Gebruikt test API keys voor ontwikkeling.

## Scope

### In scope

1. `src/lib/stripe.ts` — Stripe client + helpers (vervangt mollie.ts)
2. `src/app/api/payments/route.ts` — Stripe Checkout Session creëren (vervangt Mollie payment)
3. `src/app/api/payments/webhook/route.ts` — Stripe webhook (checkout.session.completed)
4. `src/app/(public)/checkout/page.tsx` — update checkout flow
5. `.env` — Stripe keys toevoegen, Mollie keys verwijderen
6. `package.json` — `stripe` toevoegen, `@mollie/api-client` verwijderen

### Buiten scope

- Live Stripe keys (test eerst)
- Stripe Customer portal
- Subscription/recurring payments
- Invoice PDF generation

## Technisch ontwerp

### Stripe Checkout flow

```
User clicks "Betalen"
  → POST /api/payments { orderId }
  → Create Stripe Checkout Session (line_items from order)
  → Return { checkoutUrl: session.url }
  → Redirect to Stripe hosted page
  → User pays (card or iDEAL)
  → Stripe redirects to /dashboard?payment=success
  → Stripe sends webhook to /api/payments/webhook
  → Webhook verifies signature, updates order status
```

### Payment methods

| Method | Stripe type |
|--------|------------|
| Kaart (Visa, MC) | `card` |
| iDEAL | `ideal` |

### Env vars

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Relevant Files

- `project/src/lib/mollie.ts` → verwijderen
- `project/src/lib/stripe.ts` → nieuw
- `project/src/app/api/payments/route.ts` → herschrijven
- `project/src/app/api/payments/webhook/route.ts` → herschrijven
- `project/src/app/(public)/checkout/page.tsx`
- `project/.env`
- `project/package.json`
- `CHANGELOG.md`
