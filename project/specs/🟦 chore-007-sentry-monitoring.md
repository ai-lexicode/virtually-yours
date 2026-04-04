---
id: chore-007
type: chore
status: approved
title: Sentry error tracking and Web Vitals collection
created: 2026-04-04
spec: chore-007-sentry-monitoring
parent: umb-002
size: medium
---

# chore-007: Sentry + Web Vitals Monitoring

## Problem

No error tracking or performance monitoring exists. Client-side errors go unnoticed, and there is no Web Vitals data collection for performance analysis.

## Solution

Integrate Sentry for error tracking and implement a Web Vitals collector that stores metrics in Supabase for the analytics dashboard (feat-018).

## Scope

### In scope

| Task | Details |
|------|---------|
| Install `@sentry/nextjs` | Single dependency |
| `sentry.server.config.ts` | Server init, 10% sampling prod, PII scrubbing (passwords, tokens, keys, auth headers, cookies) |
| `sentry.edge.config.ts` | Edge init, 2% sampling, header filtering |
| `instrumentation.ts` | Next.js instrumentation hook — runtime detection, env validation, `onRequestError` |
| `next.config.ts` | Wrap with `withSentryConfig()` |
| ErrorBoundary update | Add `Sentry.captureException()` to existing ErrorBoundary from chore-006 |
| WebVitals component | Client collector: LCP, INP, CLS, FCP, TTFB. Batch queue with 2s debounce, `sendBeacon` on unload, device/connection detection, session ID, exponential backoff retry |
| DB migration | `web_vitals` table + `web_vital_alerts` table (Supabase SQL migration) |
| API route | `POST /api/analytics/web-vitals` with rate limiting |

### Out of scope

- Analytics dashboard UI (feat-018)
- Web Vitals alerting logic (feat-018)
- Source maps upload to Sentry (backlog — requires CI setup)

## Relevant Files

| File | Action |
|------|--------|
| `project/sentry.server.config.ts` | Create |
| `project/sentry.edge.config.ts` | Create |
| `project/src/instrumentation.ts` | Create |
| `project/next.config.ts` | Modify — wrap with `withSentryConfig()` |
| `project/src/components/shared/ErrorBoundary.tsx` | Modify — add Sentry capture |
| `project/src/app/web-vitals.tsx` | Create — client Web Vitals collector |
| `project/src/app/layout.tsx` | Modify — add WebVitals component |
| `project/src/app/api/analytics/web-vitals/route.ts` | Create — POST endpoint |
| `supabase/migrations/20260404000002_web_vitals.sql` | Create — web_vitals + web_vital_alerts tables |
| `project/package.json` | Modify — add @sentry/nextjs |
| `CHANGELOG.md` | Update |

## Technical Details

### web_vitals table schema

```sql
CREATE TABLE web_vitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,  -- LCP, INP, CLS, FCP, TTFB
  value NUMERIC NOT NULL,
  rating TEXT,                -- good, needs-improvement, poor
  page_url TEXT NOT NULL,
  device_type TEXT,           -- mobile, tablet, desktop
  connection_speed TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_web_vitals_metric ON web_vitals(metric_name, created_at);
CREATE INDEX idx_web_vitals_page ON web_vitals(page_url, created_at);
```

### web_vital_alerts table schema

```sql
CREATE TABLE web_vital_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  page_url TEXT,
  threshold_value NUMERIC NOT NULL,
  current_p75 NUMERIC NOT NULL,
  severity TEXT DEFAULT 'warning',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
```

### API rate limiting

POST `/api/analytics/web-vitals`: max 10 requests/minute per IP (simple in-memory counter, reset per minute).

## Implementation Plan

1. `npm install @sentry/nextjs`
2. Create `sentry.server.config.ts` — init with DSN from env, 10% tracesSampleRate, PII scrubbing in `beforeSend`
3. Create `sentry.edge.config.ts` — init with 2% sampling, header filtering
4. Create `src/instrumentation.ts` — runtime detection, load appropriate Sentry config
5. Modify `next.config.ts` — wrap existing config with `withSentryConfig()`
6. Create Supabase migration for `web_vitals` + `web_vital_alerts` tables
7. Create `POST /api/analytics/web-vitals` — validate payload with Zod, rate limit, insert to Supabase
8. Create `web-vitals.tsx` client component — `useReportWebVitals`, batch queue, sendBeacon
9. Add `<WebVitals />` to root layout
10. Update ErrorBoundary — add `Sentry.captureException()` in `componentDidCatch`

## Definition of Done

- [ ] Sentry captures errors (verified with test throw)
- [ ] Web Vitals collector sends metrics to Supabase
- [ ] `web_vitals` table receives data on page load
- [ ] API route rejects invalid payloads (Zod validation)
- [ ] Rate limiting prevents abuse
- [ ] ErrorBoundary reports to Sentry
- [ ] No PII leaks in Sentry events (scrubbing verified)
