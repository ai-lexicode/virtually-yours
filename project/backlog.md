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
| ~~**Supabase OAuth redirect URLs**~~ — ✅ Fixed: code uses `NEXT_PUBLIC_SITE_URL` (bd04a9d), dashboard updated manually. | — |
| **Rotate exposed API keys (C1)** — Stripe test keys, Resend API key, Docassemble key committed in `.env`. Revoke in dashboards, regenerate, update server `.env.local` + GitHub secrets. Done: all keys rotated and old keys revoked. [bug-003](project/specs/⬜%20bug-003-critical-security-fixes.md) | — |
| **HMAC webhook verification (C3)** — Docassemble webhook uses only header API key. Implement HMAC-SHA256 signature verification. Done: webhook validates HMAC signature. [bug-003](project/specs/⬜%20bug-003-critical-security-fixes.md) | — |
| **Move service role key from Server Components (C4)** — `SUPABASE_SERVICE_ROLE_KEY` used in portal/admin layouts. Move queries to API routes. Done: no service role key in Server Components. [bug-003](project/specs/⬜%20bug-003-critical-security-fixes.md) | — |
| **Rate limiting on auth endpoints (H1)** — No rate limiting on login/register/reset. Done: sliding-window rate limiting active. [chore-003](project/specs/⬜%20chore-003-infrastructure-hardening.md) | — |
| **Accessibility & UX fixes (chore-005)** — Alt text, ARIA attributes, color contrast, empty states, loading skeletons. Done: WCAG AA compliance on all pages. [chore-005](project/specs/⬜%20chore-005-accessibility-fixes.md) | — |
| **Verify OAuth 502 fix** — Nginx buffers applied on server. Test fresh Google login end-to-end. Done: Google OAuth login works in production. | — |
<!-- clawguard-managed: backlog-log v1 -->
