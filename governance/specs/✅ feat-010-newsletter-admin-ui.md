---
spec: feat-010
type: feature
status: implemented
implemented: 2026-04-04T20:00
approved: 2026-04-04T19:15
preflight: 2026-04-04T19:15
preflight_rounds: 1
preflight_verdict: pass
title: Newsletter — admin UI
created: 2026-04-04
priority: medium
size: medium
parent: umb-001
depends_on: feat-009
source: cubania/project (admin newsletter components)
ship: direct
---

# feat-010: Newsletter Admin UI

## Doel

Admin interface voor het newsletter-systeem: composer met block editor, lijstbeheer, CSV import, verzendgeschiedenis en statistieken. Bouwt op de API routes uit feat-009.

## Scope

### In scope

#### 1. Admin sidebar update

File: `src/components/layout/AdminSidebar.tsx`

Nieuw menu-item "Newsletter" toevoegen na "Klanten":

```typescript
{ icon: Mail, label: "Newsletter", href: "/admin/newsletter" },
{ icon: Users, label: "Lijsten", href: "/admin/newsletter/lists" },
{ icon: Upload, label: "Import", href: "/admin/newsletter/import" },
{ icon: Clock, label: "Geschiedenis", href: "/admin/newsletter/history" },
{ icon: BarChart3, label: "Statistieken", href: "/admin/newsletter/stats" },
```

#### 2. Newsletter Composer page

File: `src/app/(admin)/admin/newsletter/page.tsx`
Component: `src/components/admin/NewsletterComposer.tsx`

Port van cubania `NewsletterComposer.tsx`:
- Audience selector (radio: General / Lijst + lijst dropdown)
- Block editor (`EmailEditorShell`)
- Draft opslaan/laden
- Verzendknop met bevestigingsdialoog
- Realtime verzendvoortgang (polling `/api/admin/newsletter/send/status`)

#### 3. Email Editor Shell

Component: `src/components/admin/EmailEditorShell.tsx`

Port van cubania block editor:
- Block types: heading, text, button, image, divider
- Drag & drop reordering (of up/down buttons)
- Inline editing per block
- Preview mode (rendered HTML)
- Virtually Yours branding (kleuren: `#c89c6f` gold, `#1a1a1a` dark)

#### 4. Audience Selector

Component: `src/components/admin/NewsletterAudienceSelector.tsx`

Vereenvoudigd van cubania (geen course/location/level):
- Radio: "Alle abonnees" (general) / "Specifieke lijst" (list)
- Bij "Specifieke lijst": dropdown met lijsten + ontvanger count
- Calls `GET /api/admin/newsletter/audience`

#### 5. Lijstbeheer page

File: `src/app/(admin)/admin/newsletter/lists/page.tsx`
Component: `src/components/admin/NewsletterLists.tsx`

- Lijst aanmaken (naam + beschrijving)
- Lijst bewerken/verwijderen
- Leden toevoegen (email zoeken via search-contacts)
- Leden verwijderen
- Lid count per lijst

#### 6. CSV Import page

File: `src/app/(admin)/admin/newsletter/import/page.tsx`
Component: `src/components/admin/NewsletterImport.tsx`

- File upload (CSV)
- Preview tabel (eerste 10 rijen)
- Kolom mapping (email, first_name, last_name)
- Optioneel: toevoegen aan specifieke lijst
- Resultaat: imported / duplicates / errors count

#### 7. Geschiedenis page

File: `src/app/(admin)/admin/newsletter/history/page.tsx`
Component: `src/components/admin/NewsletterHistory.tsx`

- Tabel: subject, datum, list_type, recipient_count, open rate, click rate
- Sorteerbaar op datum
- Klikbaar voor detail stats

#### 8. Statistieken page

File: `src/app/(admin)/admin/newsletter/stats/page.tsx`
Component: `src/components/admin/NewsletterStats.tsx`

- Globale stats: totaal verzonden, abonnees, gem. open rate, gem. click rate
- Per-newsletter stats (detail view)
- Recipient status breakdown (sent/delivered/opened/clicked/bounced)
- 30-dagen trend (als data beschikbaar)

#### 9. Abonnees page

File: `src/app/(admin)/admin/newsletter/subscribers/page.tsx`
Component: `src/components/admin/NewsletterSubscribers.tsx`

- Tabel: email, naam, type (user/lead), status, lijsten
- Zoekfunctie
- Export knop (CSV download)

### Buiten scope

- Drag & drop image upload (images via URL)
- A/B testing UI
- Scheduled sending UI
- Newsletter template presets

## Technisch ontwerp

### Component hiërarchie

```
/admin/newsletter/page.tsx
  └── NewsletterComposer
        ├── NewsletterAudienceSelector
        └── EmailEditorShell

/admin/newsletter/lists/page.tsx
  └── NewsletterLists

/admin/newsletter/import/page.tsx
  └── NewsletterImport

/admin/newsletter/history/page.tsx
  └── NewsletterHistory

/admin/newsletter/stats/page.tsx
  └── NewsletterStats

/admin/newsletter/subscribers/page.tsx
  └── NewsletterSubscribers
```

### Styling

Bestaande design system van Virtually Yours:
- Tailwind CSS v4
- Dark theme: `#1a1a1a` bg, `#222222` surfaces, `#c89c6f` gold accent
- Fonts: Manrope (nav), Noto Serif (headings), Inter (labels)
- Bestaande UI components: Button, Badge, Section

## Relevant Files

- `src/components/layout/AdminSidebar.tsx`
- `src/app/(admin)/admin/newsletter/page.tsx` (new)
- `src/components/admin/NewsletterComposer.tsx` (new)
- `src/components/admin/EmailEditorShell.tsx` (new)
- `src/components/admin/NewsletterAudienceSelector.tsx` (new)
- `src/components/admin/NewsletterLists.tsx` (new)
- `src/components/admin/NewsletterImport.tsx` (new)
- `src/components/admin/NewsletterHistory.tsx` (new)
- `src/components/admin/NewsletterStats.tsx` (new)
- `src/components/admin/NewsletterSubscribers.tsx` (new)

## Definition of Done

- [ ] Admin sidebar bevat Newsletter sectie met sub-items
- [ ] Newsletter composer werkt: audience selectie + block editor + verzenden
- [ ] Block editor ondersteunt heading, text, button, image, divider
- [ ] Draft opslaan en laden werkt
- [ ] Verzendvoortgang wordt getoond tijdens batch send
- [ ] Lijsten CRUD + leden beheer werkt
- [ ] CSV import verwerkt bestanden correct
- [ ] Geschiedenis toont verzonden newsletters met stats
- [ ] Statistieken dashboard toont open/click rates
- [ ] Abonnees overzicht met zoek en export
