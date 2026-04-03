# Backlog

*Last updated: 2026-04-03*

> Prioritized tasks for this project.

---

## Backlog

| Taak | Owner |
|------|-------|
| **Stripe webhook secret** — Replace `whsec_placeholder` with real webhook signing secret from Stripe Dashboard. Done: STRIPE_WEBHOOK_SECRET in .env.local on Hetzner has real value. | — |
| **Stripe live keys** — Switch from codavanza test keys to Virtually Yours own Stripe account live keys. Done: pk_live/sk_live keys in .env.local. | — |
| **Resend domain verification** — DNS records added, verification pending. Check status and re-verify if needed. Done: Resend shows `verified` for virtually-yours.nl. | — |
| **LinkedIn OIDC activation** — Request "Sign In with LinkedIn using OpenID Connect" product on LinkedIn Developer Portal. Done: LinkedIn OAuth login works end-to-end. | — |
| **Supabase OAuth redirect URLs** — Update Google/LinkedIn/GitHub OAuth redirect URLs from localhost to `https://virtually-yours.nl`. Done: OAuth login works on production domain. | — |
<!-- clawguard-managed: backlog-log v1 -->
