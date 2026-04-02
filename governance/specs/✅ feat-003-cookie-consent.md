---
spec: feat-003
type: feature
status: implemented
title: Cookie consent systeem (AP-compliant)
created: 2026-04-02
priority: high
size: medium
preflight: 2026-04-02T10:30
preflight_rounds: 1
preflight_verdict: pass
---

# feat-003: Cookie Consent Systeem (AP-compliant)

## Doel

Implementeer een GDPR/AP-compliant cookie consent systeem met banner, personalisatiepanel, GTM-integratie en cookievoorkeuren-knop in de footer. Gebaseerd op het Cubania-project, aangepast aan het Virtually Yours dark-gold thema en de eisen van de Autoriteit Persoonsgegevens.

## AP-compliance vereisten

| Vereiste | Implementatie |
|----------|---------------|
| Weigeren even makkelijk als accepteren | Beide knoppen zelfde grootte, stijl en prominentie |
| Geen dark patterns | Gelijke visuele behandeling voor alle opties |
| Geen cookie walls | Site volledig toegankelijk zonder consent |
| Geen vooraf aangevinkte opties | Analytics standaard uit |
| Informatie vóór acceptatie | Categorie-uitleg zichtbaar in personalisatiepanel |
| Consent intrekbaar | Footer-knop opent voorkeuren opnieuw |
| Analytisch zonder profiel = geen consent nodig | Essentiële cookies altijd actief |
| Audit trail | Consent-log in localStorage |

## Scope

### In scope

1. **CookieConsent component** — banner onderaan pagina
   - 3 knoppen: "Alles accepteren", "Niet-essentieel weigeren", "Personaliseren"
   - Uitklapbaar personalisatiepanel met categorieën (essentieel, analytics)
   - localStorage opslag (`vy-cookie-consent`, `vy-consent-log`)
   - Cross-tab synchronisatie via `storage` event
   - `useSyncExternalStore` pattern (zoals Cubania)

2. **useConsentTracking hook** — leest consent-status uit localStorage
   - Returns `{ analyticsConsented: boolean }`
   - Stabilized snapshots

3. **GoogleTagManager component** — conditioneel laden op basis van consent
   - Consent Mode v2 (default denied)
   - `NEXT_PUBLIC_GTM_ID` env var
   - Alleen laden bij analytics consent

4. **CookiePreferencesButton** — in footer
   - Dispatcht `open-cookie-preferences` event
   - Link naar `/privacyverklaring`

> **AP-compliance noot:** Alle 3 knoppen (accepteren, weigeren, personaliseren) moeten visueel gelijkwaardig zijn — zelfde grootte, kleur en prominentie. "Personaliseren" mag NIET als subtielere link worden gestyled. Gebruik het bestaande `Button` component (`src/components/ui/Button.tsx`) met `variant="primary"` voor accepteren, `variant="secondary"` voor weigeren, en `variant="secondary"` voor personaliseren.

1. **Footer uitbreiding** — cookievoorkeuren-link + cookiebeleid-link

### Buiten scope

- Clarity / Meta Pixel integratie (later toevoegen)
- Multi-taal ondersteuning (project is NL-only)
- Aparte cookiebeleid-pagina (verwijzen naar `/privacyverklaring`)

## Technisch ontwerp

### Nieuwe directories (bestaan nog niet)

- `src/components/public/`
- `src/hooks/`
- `src/components/tracking/`

### Nieuwe bestanden

| Bestand | Beschrijving |
|---------|-------------|
| `src/components/public/CookieConsent.tsx` | Banner + personalisatiepanel (client component) |
| `src/components/public/CookiePreferencesButton.tsx` | Footer-knop voor heropenen voorkeuren |
| `src/hooks/useConsentTracking.ts` | Hook voor consent-status |
| `src/components/tracking/GoogleTagManager.tsx` | GTM met Consent Mode v2 |

### Gewijzigde bestanden

| Bestand | Wijziging |
|---------|-----------|
| `src/app/(public)/layout.tsx` | `<CookieConsent />` toevoegen |
| `src/app/layout.tsx` | `<GoogleTagManager />` toevoegen |
| `src/components/layout/Footer.tsx` | Cookievoorkeuren-knop + cookiebeleid-link |

### Consent-categorieën

| Categorie | Standaard | Consent nodig | Cookies |
|-----------|-----------|---------------|---------|
| Essentieel | Aan (locked) | Nee | Supabase auth, CSRF |
| Analytics | Uit | Ja | GTM, GA |

### Kleurschema (project tokens)

| Element | Token | Waarde |
|---------|-------|--------|
| Banner achtergrond | `--surface-container-low` | `#222222` |
| Banner rand | `--outline-gold` | `rgba(200, 156, 111, 0.3)` |
| Tekst | `--foreground` | `#ffffff` |
| Knoppen (accept/reject) | `--primary` + `--on-primary` | `#c89c6f` / `#1a1a1a` |
| Personaliseren link | `--primary` | `#c89c6f` |
| Toggle actief | `--primary` | `#c89c6f` |
| Toggle inactief | `--outline-variant` | `#444444` |
| Muted tekst | `--muted` | `#999999` |

### LocalStorage keys

- `vy-cookie-consent` — `ConsentPreferences` object
- `vy-consent-log` — Array van `ConsentLogEntry` voor audit trail

### Event systeem

| Event | Trigger | Listener |
|-------|---------|----------|
| `storage` | Cross-tab consent wijziging | CookieConsent |
| `open-cookie-preferences` | Footer-knop klik | CookieConsent |
| `consent-updated` | Voorkeuren opgeslagen | GoogleTagManager |

## Taaklijst

1. Maak `useConsentTracking` hook
2. Maak `CookieConsent` component met banner + personalisatiepanel
3. Maak `GoogleTagManager` component met Consent Mode v2
4. Maak `CookiePreferencesButton` component
5. Integreer `CookieConsent` in `(public)/layout.tsx`
6. Integreer `GoogleTagManager` in root `layout.tsx`
7. Voeg cookievoorkeuren-knop + cookiebeleid-link toe aan Footer
8. Test: banner verschijnt, knoppen werken, consent wordt opgeslagen
9. Test: GTM laadt alleen bij analytics consent
10. Test: AP-compliance check (gelijke knoppen, geen dark patterns, geen cookie wall)

## Definition of Done

- [ ] Cookie banner verschijnt voor nieuwe bezoekers
- [ ] "Alles accepteren", "Weigeren" en "Personaliseren" zijn visueel gelijkwaardig (AP-compliant)
- [ ] Consent wordt opgeslagen in localStorage met audit log
- [ ] GTM laadt alleen bij analytics consent (Consent Mode v2)
- [ ] Footer toont cookievoorkeuren-knop die banner heropent
- [ ] Cross-tab synchronisatie werkt
- [ ] Geen cookie wall — site is volledig bruikbaar zonder consent
- [ ] Dark-gold thema consistent met rest van site

## Notes

- Cubania gebruikt `next-intl` en `useTranslations` — deze afhankelijkheden zijn niet nodig (project is NL-only). Alle teksten hardcoded in het Nederlands.
- GTM Consent Mode v2 API: gebruik `gtag('consent', 'default', {...})` en `gtag('consent', 'update', {...})`.
- Suggest web search voor actuele GTM Consent Mode v2 implementatiedetails bij implementatie.

## Preflight Log

| ID | Source | Category | What | Action |
| ---- | -------- | ---------- | ------ | -------- |
| D1 | A | 🟢 FIX | Missing `size` frontmatter field | Auto-fixed: added `size: medium` |
| D2 | B | 🟢 FIX | Missing directories not documented | Auto-fixed: added new directories section |
| D3 | B | 🟢 FIX | "Personaliseren" styled as link risks AP dark pattern violation | Auto-fixed: added AP-compliance noot requiring equal button styling |
| D4 | A | 🟡 NOTE | GTM Consent Mode v2 is external API claim | Noted: suggest web search at implementation time |

## Referenties

- Cubania cookie systeem: `cubania/project/src/components/public/CookieConsent.tsx`
- AP richtlijnen: [Clear cookie banners](https://www.autoriteitpersoonsgegevens.nl/en/themes/internet-and-smart-devices/cookies/clear-cookie-banners)
- AP regels: [The rules for cookies](https://www.autoriteitpersoonsgegevens.nl/en/themes/internet-and-smart-devices/cookies/the-rules-for-cookies)
