---
title: Infrastructure Hardening
type: chore
status: implemented
priority: high
size: M
created: 2026-04-04
spec: chore-003
slug: infrastructure-hardening
audit: audit-report-001
---

# Infrastructure Hardening

Addresses infrastructure gaps from audit (H1, H6, H9, M14, M15, M16).

## Tasks

### Rate Limiting (H1)
- Add rate limiting middleware for auth endpoints
- 5 attempts per 15 minutes per IP for login/register
- 3 attempts per hour for password reset/resend confirmation

### Health Check (M14)
- Create `GET /api/health` — returns `{ status: "ok" }` with DB ping
- Update deploy script to check health after restart

### Deployment Robustness (H9)
- Add post-restart health check (curl /api/health)
- Auto-rollback from app-old if health check fails
- Keep last 2 backups instead of 1

### Error Tracking (H6)
- Evaluate: Sentry free tier vs structured logging to file
- At minimum: replace console.log with structured logger (timestamp, severity, context)

### Environment (M16)
- Update `.env.example` with ALL required vars
- Add Stripe, GTM, webhook secret placeholders

## Definition of Done
- Auth endpoints rate-limited
- /api/health returns 200 with DB check
- Deploy script has rollback on failure
- .env.example complete
