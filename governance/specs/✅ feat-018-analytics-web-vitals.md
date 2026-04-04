---
id: feat-018
type: feature
status: implemented
title: Analytics and Web Vitals admin dashboard
created: 2026-04-04
spec: feat-018-analytics-web-vitals
parent: umb-002
depends_on: chore-007
size: large
---

# feat-018: Analytics & Web Vitals Dashboard

## Problem

No admin dashboard exists for business metrics or performance monitoring. Web Vitals data (collected by chore-007) has no visualization. Business KPIs require manual Stripe/Supabase queries.

## Dependencies

- **chore-007** must be implemented first — provides `web_vitals` table, `web_vital_alerts` table, and Web Vitals collector component.

## Solution

Create an admin analytics dashboard with two sections: business overview (Stripe data, customer/order metrics) and Web Vitals monitoring (Core Web Vitals with trends, per-page breakdown, alerts).

## Scope

### In scope

| Layer | Details |
|-------|---------|
| Admin pages | `/admin/analytics` (overview), `/admin/analytics/web-vitals` (Core Web Vitals) |
| Overview metrics | Revenue (Stripe), active customers, orders, document completion rate — 4 KPI cards |
| Web Vitals dashboard | Cards per metric (LCP, INP, CLS, FCP, TTFB) with p50/p75/p95, trends chart (SVG), page performance table, alerts list |
| API routes | `/api/admin/analytics/overview`, `/api/admin/analytics/web-vitals` (aggregated + trends + pages + alerts) |
| Alerting | Auto-detect degradation: when p75 exceeds threshold for 3+ consecutive days, create alert in `web_vital_alerts` |

### Out of scope

- Date range picker (v1 shows last 30 days fixed)
- Export/download functionality
- Revenue chart visualization (v1 shows number only)
- Conversion funnel
- Real-time dashboard (data refreshes on page load)

## Relevant Files

| File | Action |
|------|--------|
| `project/src/app/(admin)/admin/analytics/page.tsx` | Create — overview dashboard |
| `project/src/app/(admin)/admin/analytics/web-vitals/page.tsx` | Create — Web Vitals dashboard |
| `project/src/components/admin/analytics/KPICard.tsx` | Create — metric card |
| `project/src/components/admin/analytics/WebVitalsCard.tsx` | Create — per-metric card with p50/p75/p95 |
| `project/src/components/admin/analytics/WebVitalsTrend.tsx` | Create — SVG trend chart |
| `project/src/components/admin/analytics/WebVitalsTable.tsx` | Create — per-page table |
| `project/src/components/admin/analytics/WebVitalsAlerts.tsx` | Create — alerts list |
| `project/src/app/api/admin/analytics/overview/route.ts` | Create — business KPIs |
| `project/src/app/api/admin/analytics/web-vitals/route.ts` | Create — aggregated metrics |
| `project/src/app/api/admin/analytics/web-vitals/trends/route.ts` | Create — daily trends |
| `project/src/app/api/admin/analytics/web-vitals/pages/route.ts` | Create — per-page breakdown |
| `project/src/app/api/admin/analytics/web-vitals/alerts/route.ts` | Create — alerts CRUD |
| `project/src/lib/services/web-vitals-service.ts` | Create — aggregation queries |
| `CHANGELOG.md` | Update |

## Technical Details

### Web Vitals aggregation query

```sql
SELECT
  metric_name,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) AS p50,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value) AS p75,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY value) AS p95,
  COUNT(*) as sample_count
FROM web_vitals
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY metric_name
```

### Web Vitals thresholds (Google standards)

| Metric | Good | Needs improvement | Poor |
|--------|------|-------------------|------|
| LCP | <2.5s | 2.5-4s | >4s |
| INP | <200ms | 200-500ms | >500ms |
| CLS | <0.1 | 0.1-0.25 | >0.25 |
| FCP | <1.8s | 1.8-3s | >3s |
| TTFB | <800ms | 800-1800ms | >1800ms |

### Auto-alert logic

Run on each `/api/admin/analytics/web-vitals` request (or separate cron): if p75 of any metric exceeds "poor" threshold for 3+ of the last 7 daily aggregates, create an alert row.

### Overview KPIs (Stripe + Supabase)

| KPI | Source | Query |
|-----|--------|-------|
| Revenue (30d) | Stripe API | `stripe.charges.list({created: {gte: 30d_ago}})` → sum amounts |
| Active customers | Supabase | `profiles` where last active <30d |
| Orders (30d) | Supabase | `orders` count where `created_at > 30d ago` |
| Document completion rate | Supabase | completed docs / total docs (30d) |

## Implementation Plan

1. Create `web-vitals-service.ts` — aggregation, trends, per-page, alert detection queries
2. Create API routes: overview (Stripe + Supabase queries), web-vitals (aggregated), trends (daily), pages (per-page), alerts (list + resolve)
3. Create components: KPICard, WebVitalsCard (color-coded by rating), WebVitalsTrend (inline SVG line chart), WebVitalsTable, WebVitalsAlerts
4. Create overview page with 4 KPI cards
5. Create Web Vitals page with metric cards, trend chart, page table, alerts
6. Add analytics link to admin navigation
7. Implement auto-alert detection in web-vitals service

## Definition of Done

- [ ] Admin overview shows Revenue, Active customers, Orders, Document completion rate
- [ ] Web Vitals page shows p50/p75/p95 for all 5 metrics with color coding
- [ ] Trend chart visualizes last 30 days of daily aggregates
- [ ] Per-page table shows worst-performing pages
- [ ] Alerts fire when p75 exceeds poor threshold for 3+ consecutive days
- [ ] Admin can resolve/dismiss alerts
- [ ] Analytics accessible from admin navigation
