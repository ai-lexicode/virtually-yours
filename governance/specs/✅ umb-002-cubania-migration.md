---
title: Cubania Feature Migration
spec: umb-002
type: umbrella
status: implemented
implemented: 2026-04-04
priority: high
size: large
created: 2026-04-04
preflight: 2026-04-04T12:00
preflight_rounds: 1
preflight_verdict: pass
source: "/Users/djmulato/proyectos_ai/Proyectos_AI_2026/cubania/project"
database: supabase (no Prisma)
---

# umb-002 — Cubania Feature Migration

Migrar 5 sistemas probados de cubania a virtualy-yours, adaptados a Supabase (sin Prisma).

## Scope

| # | Sub-spec | Type | Wave | Depends on | Estimated files |
|---|----------|------|------|-----------|-----------------|
| 1 | chore-006-ui-shared-components | chore | 1 | — | ~8 |
| 2 | chore-007-sentry-monitoring | chore | 1 | — | ~6 |
| 3 | feat-016-blog-system | feature | 2 | — | ~25 |
| 4 | feat-017-newsletter-drip | feature | 2 | — | ~10 |
| 5 | feat-018-analytics-web-vitals | feature | 3 | chore-007 | ~20 |

## Execution Order

```
Wave 1 (parallel, no deps):  chore-006 + chore-007
Wave 2 (parallel, no deps):  feat-016 + feat-017
Wave 3 (depends on chore-007): feat-018
```

## Sub-spec Summaries

### chore-006 — UI Shared Components

Migrar componentes reutilizables de cubania adaptados al stack de virtualy-yours.

| Component | Source | Adaptation |
|-----------|--------|------------|
| ErrorBoundary | `src/components/shared/ErrorBoundary.tsx` | Remove Sentry import (added in chore-007), keep fallback UI |
| EmptyState | `src/components/shared/EmptyState.tsx` | Replace cubania brand colors with virtualy-yours theme |
| SkeletonCard | `src/components/shared/SkeletonCard.tsx` | Minimal adaptation |
| SkeletonTable | `src/components/shared/SkeletonTable.tsx` | Minimal adaptation |

**DoD:** Components render correctly, exported from shared index, used in at least 1 existing page each.

### chore-007 — Sentry + Web Vitals Monitoring

Integrar Sentry error tracking y Web Vitals collection client-side.

| Task | Details |
|------|---------|
| Install deps | `@sentry/nextjs` |
| sentry.server.config.ts | Server init, 10% sampling prod, sensitive data scrubbing |
| sentry.edge.config.ts | Edge init, 2% sampling, header filtering |
| next.config.ts | Wrap with `withSentryConfig()` |
| ErrorBoundary update | Add `Sentry.captureException()` (after chore-006) |
| WebVitals component | Client collector with batch queue, sendBeacon on unload |
| DB migration | `web_vitals` table + `web_vital_alerts` table (Supabase SQL) |
| API route | `POST /api/analytics/web-vitals` with rate limiting |

**DoD:** Sentry captures errors in production, Web Vitals recorded to Supabase, health verified via test error + test metric.

### feat-016 — Blog System

Reemplazar el blog estático actual (`/nieuws/`) con un sistema dinámico basado en DB.

**Existing state:** 4 artículos hardcoded en React components en `src/app/(public)/nieuws/`. Categorías: Arbeidsrecht, Privacy, Ondernemingsrecht. Sin DB, sin admin UI.

| Layer | Details |
|-------|---------|
| DB tables | `blog_categories` (id, name, slug), `blog_posts` (id, title, slug, content, excerpt, cover_image, status, published_at, category_id, author_id, meta_title, meta_description) |
| Admin pages | `/admin/blog` (list + CRUD), `/admin/blog/[id]` (edit), `/admin/blog/new` (create), `/admin/blog/categories` |
| Public pages | Replace `/nieuws/` with DB-driven pages (keep `/nieuws/` URL path for SEO continuity) |
| API routes | Admin CRUD + public listing + RSS feed |
| Features | Markdown content, status (DRAFT/PUBLISHED/ARCHIVED), SEO fields, pagination, search |
| Data migration | Seed the 4 existing articles into DB via migration script |

**Excluded:** AI generation (Anthropic SDK dependency — backlog item for later).

**DoD:** Admin can create/edit/publish posts with categories, public users can browse blog with pagination, RSS feed works, SEO metadata renders, existing 4 articles preserved in DB.

### feat-017 — Newsletter Drip Campaigns

Agregar campañas drip al newsletter existente. Segmentación, listas, click tracking y admin UI ya implementados.

**Existing state (already implemented):**
- DB: `newsletter_lists`, `newsletter_list_members`, `newsletter_clicks`, `newsletter_recipients` tables exist
- API: List CRUD (`/api/admin/newsletter/lists/`), member management, audience selector, click tracking, stats, import
- Admin UI: Lists page, subscribers page, history, import, stats pages

| Layer | Details |
|-------|---------|
| Drip campaigns | Welcome sequence on new subscriber, re-engagement trigger (inactive >30 days) |
| DB additions | `newsletter_drip_sequences` (id, name, trigger_type, is_active), `newsletter_drip_steps` (sequence_id, delay_days, subject, content, order) |
| API routes | Drip sequence CRUD, drip execution cron endpoint |
| Admin UI | Drip sequence builder page at `/admin/newsletter/drip` |
| Cron job | Check for pending drip sends, execute at scheduled intervals |

**DoD:** Admin can create/edit drip sequences, welcome drip fires on new subscriber confirmation, re-engagement drip fires for inactive subscribers (>30 days no opens).

### feat-018 — Analytics & Web Vitals Dashboard

Dashboard admin con métricas de negocio y Web Vitals.

| Layer | Details |
|-------|---------|
| Admin pages | `/admin/analytics` (overview), `/admin/analytics/web-vitals` (Core Web Vitals) |
| Overview metrics | Revenue (Stripe data), active customers, orders, document completion rate |
| Web Vitals dashboard | Cards per metric (LCP, INP, CLS, FCP, TTFB) with p50/p75/p95, trends chart, page performance table, alerts |
| API routes | `/api/admin/analytics/overview`, `/api/admin/analytics/web-vitals` (aggregated + trends + pages + alerts) |
| Service | Web Vitals aggregation with PostgreSQL `PERCENTILE_CONT()`, auto-alert on degradation |

**Depends on:** chore-007 (web_vitals table + collector must exist).

**DoD:** Admin dashboard shows business KPIs and Web Vitals with historical trends, alerts fire on degradation.

## Exclusions

| Item | Reason |
|------|--------|
| Prisma migration | User chose Supabase-only (2A) |
| AI blog generation | Separate concern, backlog |
| Mollie payment integration | virtualy-yours uses Stripe |
| Course/enrollment system | Domain-specific to cubania |
| Ticket/event system | Domain-specific to cubania |
| Puck CMS/Page builder | Not in selected items |
| Referral/Gift cards | Not in selected items |
| ScrollReveal component | Low value, CSS-only alternative |
| Breadcrumbs component | Uses next-intl (cubania-specific i18n) |

## Risks

| Risk | Mitigation |
|------|-----------|
| Newsletter upgrade breaks existing flow | feat-017 is additive only — no changes to existing tables/routes |
| Sentry bundle size impact | Tree-shaking + lazy loading of Sentry client |
| Web Vitals table grows large | 1-year retention cleanup cron + indexed queries |
| Blog markdown rendering | Use existing markdown lib or add `react-markdown` |

## Success Criteria

1. All 5 sub-specs pass their DoD
2. No regressions in existing newsletter functionality
3. Admin panel has Blog, Analytics sections accessible
4. Sentry receives test error in production
5. Web Vitals p75 values visible in dashboard within 24h of deploy

## Preflight Log

| ID | Source | Category | What | Action |
|----|--------|----------|------|--------|
| D1 | B | 🟢 FIX | Missing `size` frontmatter field | Auto-fixed: added `size: large` |
| D2 | B | 🟡 NOTE | feat-017 claimed to create DB tables and API routes that already exist (newsletter_lists, newsletter_list_members, newsletter_clicks + CRUD routes) | Applied — 👁️ review recommended |
| D3 | B | 🟡 NOTE | feat-016 didn't mention existing static blog at `/nieuws/` (4 hardcoded articles) or data migration plan | Applied — 👁️ review recommended |
| D4 | A | 🟡 NOTE | feat-017 renamed from "segmentation" to "drip" — segmentation already implemented, only drip campaigns are new | Applied — 👁️ review recommended |

## 👁️ Judgment Fixes for Review

| ID | Delta | Issue | Options considered | Chosen | Rationale | Change |
|----|-------|-------|--------------------|--------|-----------|--------|
| J1 | D2 | feat-017 scope included already-existing infrastructure | A) Keep full scope (re-verify existing); B) Remove existing, focus on new (drip only); C) Split: verify existing + add new | B) Focus on drip only | DB tables, API routes, and admin UI for lists/segmentation/clicks already exist and work. Duplicating scope wastes implementation time and risks regressions. | Rewrote feat-017 scope to acknowledge existing state, narrowed to drip campaigns only |
| J2 | D3 | feat-016 would create parallel blog alongside existing `/nieuws/` | A) Create new `/blog/` path; B) Replace `/nieuws/` with DB-driven version; C) Keep both | B) Replace with DB-driven | SEO continuity (existing URLs indexed), avoids duplicate content, cleaner architecture. Added seed migration for 4 existing articles. | Added "Existing state" section, changed public pages to replace `/nieuws/`, added data migration task |
| J3 | D4 | Umbrella sub-spec name mismatch after scope correction | A) Keep old name; B) Rename to match actual scope | B) Rename | Spec name should reflect actual content for clarity in QUEUE and orchestration | Renamed feat-017-newsletter-segmentation → feat-017-newsletter-drip in scope table |
