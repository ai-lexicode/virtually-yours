---
id: feat-014
type: feature
status: approved
title: Newsletter statistics tab navigation
created: 2026-04-04
preflight: 2026-04-04T15:30
spec: feat-014-newsletter-stats-tabs
---

# feat-014: Newsletter Statistics Tab Navigation

## Problem

The newsletter stats page (`/admin/newsletter/stats`) shows general aggregate metrics and a per-newsletter table in a single scrollable view. The per-newsletter section only appears when newsletters exist, making the page feel empty. There is no clear navigation between general overview and individual newsletter stats.

## Solution

Add tab navigation to the stats page with two views:

1. **Algemeen** (General) — current aggregate stats (total sent, subscribers, avg open %, avg click %) + 30-day trend chart
2. **Per nieuwsbrief** (Per newsletter) — list of sent newsletters with inline metrics (recipients, open %, click %) + click-through to detail view

## Scope

### In scope

- Tab bar component with "Algemeen" and "Per nieuwsbrief" tabs
- General tab: keep current 4 metric cards + add trend chart (data already returned by API)
- Per-newsletter tab: table of sent newsletters with columns: subject, date, recipients, open %, click %, detail button
- Per-newsletter detail view: keep existing `NewsletterDetailView` (metrics + click map)
- Empty state for per-newsletter tab when no newsletters sent
- URL param sync (`?tab=general` / `?tab=per-newsletter`) for shareability

### Out of scope

- New API endpoints (all data already available)
- Export/download functionality
- Date range filters

## Technical Plan

### Files to modify

| File | Change |
|------|--------|
| `project/src/components/admin/NewsletterStats.tsx` | Add tab state, refactor into General and PerNewsletter sub-views, add trend chart, enrich newsletter table with open/click rates |

### API changes

| Endpoint | Change |
|----------|--------|
| `GET /api/admin/newsletter/history` | Add `openRate` and `clickRate` per newsletter item (currently only returns subject, date, recipientCount) |

### Implementation details

1. **Tab component**: styled tab bar matching the dark theme (`bg-[#1a1a1a]`, `border-card-border`, `text-primary` for active tab)
2. **General tab**: current 4 `MetricCard` components + inline SVG bar chart for `trend` data (no chart lib — lightweight custom SVG)
3. **Per-newsletter tab**: enhanced table with open/click rate columns, fetched from enriched history endpoint
4. **URL sync**: use `useSearchParams` (wrapped in `Suspense` boundary per Next.js App Router requirement) to read/write `tab` param, default to `general`
5. **Detail navigation**: clicking a newsletter in the per-newsletter tab shows `NewsletterDetailView` (existing component), with back button returning to per-newsletter tab

### Enriched history response

```typescript
// Current
{ id, subject, sentAt, recipientCount, sentBy }

// New fields added
{ id, subject, sentAt, recipientCount, sentBy, openRate, clickRate }
```

Computed server-side from `newsletter_recipients` status counts per newsletter.

## Definition of Done

- [ ] Tab bar renders with "Algemeen" and "Per nieuwsbrief" options
- [ ] General tab shows 4 metric cards + trend visualization
- [ ] Per-newsletter tab shows table with subject, date, recipients, open %, click %
- [ ] Clicking a newsletter opens detail view with back-to-tab navigation
- [ ] Empty state shown when no newsletters exist
- [ ] Tab selection persists in URL params
- [ ] Responsive layout works on mobile (tabs stack or scroll)
