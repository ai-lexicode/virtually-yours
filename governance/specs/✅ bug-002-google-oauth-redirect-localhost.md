---
status: implemented
created: 2026-04-03T12:00
modified: 2026-04-03T18:00
preflight:
preflight_rounds:
preflight_verdict:
approved:
reviewed:
implemented: 2026-04-03T18:00
amends:
superseded_by:
sessions:
  plan: 
  edits:
  implement:
ship: direct
size: small
type: bug
spec: bug-002
title: Google OAuth redirect naar localhost i.p.v. productie-URL
slug: google-oauth-redirect-localhost
---

# Bug: Google OAuth redirect naar localhost i.p.v. productie-URL

## Description

Bij inloggen met Google wordt de gebruiker na authenticatie teruggestuurd naar `http://localhost:3000` in plaats van `https://virtually-yours.nl`. Dit maakt Google OAuth onbruikbaar in productie.

**Verwacht:** Na Google login → redirect naar `https://virtually-yours.nl/auth/callback` → dashboard/admin.
**Actueel:** Na Google login → redirect naar `http://localhost:3000/auth/callback` → pagina niet bereikbaar.

## Steps to Reproduce

1. Ga naar `https://virtually-yours.nl/inloggen`
2. Klik op "Doorgaan met Google"
3. Voltooi Google authenticatie
4. Observeer dat de redirect naar `localhost:3000` gaat

## Root Cause Analysis

Twee samenhangende oorzaken:

1. **Code:** `SocialAuthButtons.tsx:62` gebruikt `window.location.origin` voor de `redirectTo` parameter. Dit zou in productie correct moeten zijn (`https://virtually-yours.nl`), maar Supabase valideert deze URL tegen de geconfigureerde **Site URL** en **Redirect URLs** in het dashboard.

2. **Supabase Dashboard (primaire oorzaak):** De **Site URL** in Supabase Authentication settings staat nog op `http://localhost:3000`. Supabase gebruikt de Site URL als fallback wanneer de redirect URL niet in de allowlist staat. Omdat `https://virtually-yours.nl/auth/callback` niet is toegevoegd aan de Redirect URLs, valt Supabase terug op de Site URL (localhost).

## Proposed Solution

1. **Supabase Dashboard** (handmatige stap): Site URL wijzigen naar `https://virtually-yours.nl` en `https://virtually-yours.nl/auth/callback` toevoegen aan Redirect URLs
2. **Code hardening:** `redirectTo` in `SocialAuthButtons.tsx` wijzigen van `window.location.origin` naar `process.env.NEXT_PUBLIC_SITE_URL` zodat de productie-URL altijd expliciet wordt meegegeven, ongeacht de browser context

## Relevant Files

| File | Role |
|------|------|
| `project/src/components/auth/SocialAuthButtons.tsx` | OAuth redirectTo URL (regel 62) |
| `project/src/app/auth/callback/route.ts` | Callback handler (geen code-wijziging nodig) |
| `project/.env` | `NEXT_PUBLIC_SITE_URL` reeds geconfigureerd |

## Plan

### Step 1: Supabase Dashboard — Site URL en Redirect URLs configureren

**Handmatige stap (gebruiker):**

1. Ga naar [Supabase Dashboard](https://supabase.com/dashboard/project/wwfloeinidmepoclhedw/auth/url-configuration)
2. Stel **Site URL** in op: `https://virtually-yours.nl`
3. Voeg toe aan **Redirect URLs**:
   - `https://virtually-yours.nl/auth/callback`
   - `http://localhost:3000/auth/callback` (voor lokale development)
4. Sla op

### Step 2: Code — Gebruik NEXT_PUBLIC_SITE_URL voor redirectTo

In `project/src/components/auth/SocialAuthButtons.tsx`, wijzig regel 62:

```diff
- redirectTo: `${window.location.origin}/auth/callback`,
+ redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
```

Dit zorgt ervoor dat de productie-URL altijd wordt gebruikt wanneer `NEXT_PUBLIC_SITE_URL` is gezet, met `window.location.origin` als fallback voor lokale development zonder env var.

### Step 3: Validatie

1. Deploy de code-wijziging
2. Ga naar `https://virtually-yours.nl/inloggen`
3. Klik "Doorgaan met Google"
4. Verifieer dat de redirect naar `https://virtually-yours.nl/auth/callback` gaat
5. Verifieer dat je op het dashboard of admin portaal terechtkomt

## Notes

- De `.env` heeft al `NEXT_PUBLIC_SITE_URL=https://virtually-yours.nl` geconfigureerd (regel 6), dus de code-wijziging pakt direct de juiste waarde
- LinkedIn en GitHub OAuth hebben hetzelfde probleem — de fix in `SocialAuthButtons.tsx` lost het voor alle providers tegelijk op
- Lokale development blijft werken: als `NEXT_PUBLIC_SITE_URL` niet in `.env.local` staat, valt het terug op `window.location.origin` (localhost:3000)

## Preflight Log

| ID | Category | What | Action | Source |
|----|----------|------|--------|--------|
