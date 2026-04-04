---
id: feat-017
type: feature
status: implemented
title: Newsletter drip campaign sequences
created: 2026-04-04
spec: feat-017-newsletter-drip
parent: umb-002
size: medium
---

# feat-017: Newsletter Drip Campaigns

## Problem

The newsletter system supports manual sends but has no automated sequences. New subscribers receive no welcome series, and inactive subscribers (>30 days no opens) get no re-engagement outreach.

## Existing State (already implemented)

- DB: `newsletter_subscriptions`, `newsletter_leads`, `newsletter_lists`, `newsletter_list_members`, `newsletters`, `newsletter_recipients`, `newsletter_clicks`
- API: List CRUD, member management, audience selector, click tracking, stats, import, send/process
- Admin UI: Composer, lists, subscribers, history, import, stats pages
- Email: Resend integration with open/click tracking

## Solution

Add drip campaign functionality: automated email sequences triggered by subscriber events. Two initial sequences: welcome (on confirmation) and re-engagement (inactive >30 days).

## Scope

### In scope

| Layer | Details |
|-------|---------|
| DB tables | `newsletter_drip_sequences` (id, name, trigger_type, is_active, created_at, updated_at), `newsletter_drip_steps` (id, sequence_id, delay_days, subject, content, step_order, created_at), `newsletter_drip_sends` (id, step_id, subscriber_email, sent_at, status) |
| API routes | Sequence CRUD, drip execution endpoint |
| Admin UI | `/admin/newsletter/drip` — sequence builder with step management |
| Cron endpoint | `POST /api/cron/newsletter-drip` — check pending drip sends, execute |
| Welcome trigger | On subscriber confirmation (`newsletter_leads.confirmed_at` set), enqueue welcome sequence |
| Re-engagement trigger | Cron checks for subscribers with no opens >30 days, enqueues re-engagement sequence |

### Out of scope

- Visual drag-and-drop sequence builder
- A/B testing of drip emails
- Conditional branching in sequences
- Drip analytics dashboard (stats visible in existing newsletter stats)

## Relevant Files

| File | Action |
|------|--------|
| `supabase/migrations/20260404000004_newsletter_drip.sql` | Create — drip tables |
| `project/src/app/api/admin/newsletter/drip/route.ts` | Create — GET/POST sequences |
| `project/src/app/api/admin/newsletter/drip/[id]/route.ts` | Create — GET/PUT/DELETE sequence |
| `project/src/app/api/admin/newsletter/drip/[id]/steps/route.ts` | Create — GET/POST steps |
| `project/src/app/api/admin/newsletter/drip/[id]/steps/[stepId]/route.ts` | Create — PUT/DELETE step |
| `project/src/app/api/cron/newsletter-drip/route.ts` | Create — cron execution |
| `project/src/app/api/newsletter/confirm/[token]/route.ts` | Modify — trigger welcome drip on confirmation |
| `project/src/app/(admin)/admin/newsletter/drip/page.tsx` | Create — drip admin page |
| `project/src/components/admin/NewsletterDrip.tsx` | Create — sequence builder UI |
| `CHANGELOG.md` | Update |

## Technical Details

### trigger_type enum

```sql
CREATE TYPE drip_trigger_type AS ENUM ('welcome', 're_engagement');
```

### Drip execution logic (cron)

1. Query `newsletter_drip_sequences` where `is_active = true`
2. For `welcome` sequences: find confirmed leads with no drip send record, calculate which step is due based on `confirmed_at + delay_days`
3. For `re_engagement` sequences: find subscribers whose last open in `newsletter_recipients` is >30 days ago, no active drip send
4. For each due send: create `newsletter_drip_sends` record, send email via Resend (reuse existing send infrastructure)
5. Respect unsubscribe status — skip subscribers with `unsubscribed_at` set

### Cron security

Endpoint protected by `CRON_SECRET` env var in Authorization header (same pattern as other cron endpoints if any, or simple bearer token check).

## Implementation Plan

1. Create Supabase migration: `newsletter_drip_sequences`, `newsletter_drip_steps`, `newsletter_drip_sends` tables with RLS
2. Create sequence CRUD API routes (admin auth)
3. Create step CRUD API routes (nested under sequence)
4. Create cron execution endpoint with trigger logic
5. Modify confirmation endpoint to enqueue welcome drip
6. Create admin UI: sequence list, create/edit form, step editor (add/reorder/delete steps with subject + content fields)
7. Add drip link to newsletter admin navigation

## Definition of Done

- [ ] Admin can create/edit/delete drip sequences with multiple steps
- [ ] Welcome drip fires automatically on new subscriber confirmation
- [ ] Re-engagement drip fires for subscribers inactive >30 days
- [ ] Drip emails sent via Resend with tracking
- [ ] Unsubscribed users excluded from drip sends
- [ ] Cron endpoint secured with CRON_SECRET
- [ ] Admin UI shows sequence list with active/inactive toggle
