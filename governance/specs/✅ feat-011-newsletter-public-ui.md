---
spec: feat-011
type: feature
status: implemented
implemented: 2026-04-04T21:00
approved: 2026-04-04T20:15
preflight: 2026-04-04T20:15
preflight_rounds: 1
preflight_verdict: pass
title: Newsletter — public UI + email templates
created: 2026-04-04
priority: medium
size: small
parent: umb-001
depends_on: feat-009
source: cubania/project (public newsletter components + email templates)
ship: direct
---

# feat-011: Newsletter Public UI + Email Templates

## Doel

Publieke subscribe/unsubscribe pagina's en email templates voor het newsletter-systeem. Bouwt op de API routes uit feat-009.

## Scope

### In scope

#### 1. Newsletter subscribe formulier

Component: `src/components/public/NewsletterForm.tsx`

Plaatsing: footer van de website (of dedicated pagina)

- Email input + submit button
- Success state: "Controleer uw email voor bevestiging" (leads) of "U bent aangemeld" (users)
- Error handling
- Calls `POST /api/newsletter`
- Styled in Virtually Yours design (dark theme, gold accent)

#### 2. Footer integratie

File: `src/components/layout/Footer.tsx`

- `NewsletterForm` toevoegen aan bestaande footer
- Sectie: "Blijf op de hoogte" of "Newsletter"

#### 3. Email templates

File: `src/emails/NewsletterConfirmEmail.tsx`

Double opt-in bevestigingsmail:
- Subject: "Bevestig uw aanmelding voor de Virtually Yours newsletter"
- Body: welkomstbericht + bevestigingslink
- Uses bestaande `EmailLayout`, `EmailHeading`, `EmailText`, `EmailButton` components
- Link: `{SITE_URL}/api/newsletter/confirm/{token}`

File: `src/emails/NewsletterWelcomeEmail.tsx`

Welkomstmail na bevestiging:
- Subject: "Welkom bij de Virtually Yours newsletter"
- Body: bevestiging van aanmelding + wat te verwachten
- Unsubscribe link in footer

#### 4. Resend functies toevoegen

File: `src/lib/resend.ts`

```typescript
export async function sendNewsletterConfirmation(to: string, confirmUrl: string): Promise<void>
export async function sendNewsletterWelcome(to: string): Promise<void>
```

#### 5. Confirm pagina

File: `src/app/(public)/newsletter/bevestigd/page.tsx`

Redirect target na bevestiging:
- Success: "Uw aanmelding is bevestigd!"
- Expired: "Deze link is verlopen. Meld u opnieuw aan."

#### 6. Unsubscribe pagina

File: `src/app/(public)/newsletter/uitschrijven/[token]/page.tsx`
Component: `src/components/public/UnsubscribePage.tsx`

- Toont huidige status (actief/inactief)
- Knop: "Uitschrijven"
- Bevestiging na uitschrijven
- Calls `GET/POST /api/newsletter/unsubscribe/{token}`

### Buiten scope

- Newsletter preference center (complexe UI met per-categorie toggles)
- Archive van verzonden newsletters (publiek leesbaar)
- Social sharing van newsletters

## Relevant Files

- `src/components/public/NewsletterForm.tsx` (new)
- `src/components/layout/Footer.tsx`
- `src/emails/NewsletterConfirmEmail.tsx` (new)
- `src/emails/NewsletterWelcomeEmail.tsx` (new)
- `src/lib/resend.ts`
- `src/app/(public)/newsletter/bevestigd/page.tsx` (new)
- `src/app/(public)/newsletter/uitschrijven/[token]/page.tsx` (new)
- `src/components/public/UnsubscribePage.tsx` (new)

## Definition of Done

- [ ] Subscribe formulier in footer werkt voor users en bezoekers
- [ ] Double opt-in: lead ontvangt bevestigingsmail
- [ ] Bevestigingslink activeert lead
- [ ] Welkomstmail wordt verzonden na bevestiging
- [ ] Bevestigingspagina toont juiste status (success/expired)
- [ ] Unsubscribe pagina werkt voor zowel subscriptions als leads
- [ ] Email templates gebruiken Virtually Yours branding
