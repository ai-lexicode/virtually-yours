---
spec: feat-013
type: feature
status: implemented
implemented: 2026-04-04T22:45
approved: 2026-04-04T22:30
preflight: 2026-04-04T22:30
preflight_rounds: 1
preflight_verdict: pass
title: Newsletter integration — image links, settings toggle, registration opt-in
created: 2026-04-04
priority: medium
size: small
depends_on: feat-012
ship: direct
---

# feat-013: Newsletter Integration Fixes

## Doel

Drie verbeteringen: (1) afbeeldingen in newsletter editor kunnen linken naar een URL, (2) Nieuwsbrief toggle in Instellingen werkt met de newsletter_subscriptions tabel, (3) registratiepagina heeft newsletter opt-in checkbox (standaard aangevinkt).

## Scope

### In scope

#### 1. Image link support in editor + renderer

File: `src/components/admin/EmailEditorShell.tsx`

- Add `href` prop to `email-image` default props: `{ src: "", alt: "", width: 600, align: "center", href: "" }`
- Add "Link URL" field in BlockEditor for email-image
- Update BlockPreview: if href is set, show a small link icon overlay

File: `src/lib/newsletter/render-blocks-to-html.ts`

- Update `renderImageBlock` type to include `href?: string`
- When `href` is set: wrap `<img>` in `<a href="..." style="text-decoration:none;">`
- When `href` is empty: render `<img>` without link (current behavior)

#### 2. Newsletter toggle in Instellingen

Current: toggle saves to Supabase Auth user metadata (`data.notifications.marketing`). This is disconnected from the `newsletter_subscriptions` table used by the send system.

File: `src/app/(portal)/instellingen/page.tsx`

- On toggle change for "Nieuwsbrief": call `POST /api/newsletter/preferences` (already exists) to create/update `newsletter_subscriptions` record
- On page load: fetch current state from `GET /api/newsletter/preferences` and sync with toggle
- Keep existing metadata update for backward compat, but add API call as primary source

#### 3. Newsletter opt-in on registration

File: `src/app/(auth)/registreren/page.tsx`

- Add checkbox below the algemene voorwaarden: "Ik wil de Virtually Yours nieuwsbrief ontvangen" — checked by default
- Store state in form as `newsletter: boolean`

File: `src/app/api/auth/register/route.ts`

- Add `newsletter: z.boolean().optional().default(true)` to schema
- After successful user creation: if `newsletter` is true, create `newsletter_subscriptions` record with `is_active: true, general: true` using service role client

### Buiten scope

- Newsletter preferences page (multiple categories)
- Double opt-in for registered users (they confirmed email via registration)
- Unsubscribe from registration flow

## Relevant Files

- `src/components/admin/EmailEditorShell.tsx`
- `src/lib/newsletter/render-blocks-to-html.ts`
- `src/app/(portal)/instellingen/page.tsx`
- `src/app/(auth)/registreren/page.tsx`
- `src/app/api/auth/register/route.ts`
- `src/app/api/newsletter/preferences/route.ts` (existing, verify)

## Definition of Done

- [ ] Image blocks in editor have optional "Link URL" field
- [ ] Images with href render as clickable links in sent emails
- [ ] Images without href render as plain images (no regression)
- [ ] Nieuwsbrief toggle in Instellingen creates/updates newsletter_subscriptions record
- [ ] Toggle state reflects actual newsletter_subscriptions status on page load
- [ ] Registration form has newsletter checkbox, checked by default
- [ ] Completing registration with checkbox on creates newsletter_subscriptions record
- [ ] Completing registration with checkbox off does not create subscription
