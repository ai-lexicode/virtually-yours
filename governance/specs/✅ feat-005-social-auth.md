---
spec: feat-005
type: feature
status: implemented
title: Social login (Google, LinkedIn, GitHub) met bedrijfsgegevens-stap
created: 2026-04-03
approved: 2026-04-03T10:00
implemented: 2026-04-03T10:30
priority: high
size: medium
preflight: 2026-04-03T10:00
preflight_rounds: 1
preflight_verdict: pass with advisories
ship: direct
---

# feat-005: Social Login (Google, LinkedIn, GitHub)

## Doel

Voeg OAuth-registratie en login toe met Google, Apple, LinkedIn en GitHub. Na eerste OAuth-login toont een tussenstap-formulier voor bedrijfsgegevens (bedrijfsnaam, KvK-nummer) voordat de gebruiker naar het dashboard gaat.

## Beslissingen

| Beslissing | Keuze | Reden |
|------------|-------|-------|
| Providers | Google, LinkedIn, GitHub | Google = standaard NL, LinkedIn = perfect voor freelancer/VA doelgroep, GitHub = developers/tech VA's |
| Post-OAuth flow | Tussenstap voor bedrijfsgegevens | Vermindert geen friction bij registratie maar verzamelt wel bedrijfsdata die nodig is voor documenten |

## Scope

### In scope

1. **OAuth callback route** — `src/app/auth/callback/route.ts`
   - Supabase PKCE flow: exchange code for session
   - Redirect naar `/profiel-aanvullen` als bedrijfsgegevens ontbreken, anders naar dashboard

2. **Social login knoppen** — component `SocialAuthButtons.tsx`
   - 4 knoppen: Google, LinkedIn, GitHub
   - Gebruikt `supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })`
   - Gedeeld tussen `/registreren` en `/inloggen` pagina's
   - Visueel gescheiden van email/wachtwoord-formulier met "of" divider

3. **Profiel-aanvullen pagina** — `src/app/(auth)/profiel-aanvullen/page.tsx`
   - Toont na eerste OAuth-login als `company_name` leeg is in profiles
   - Velden: bedrijfsnaam, KvK-nummer (optioneel), "Overslaan" link
   - Slaat op naar `profiles` tabel via API of direct Supabase client
   - Redirect naar dashboard na opslaan/overslaan

4. **Middleware update** — redirect logica voor profiel-aanvullen
   - Authenticated + geen bedrijfsnaam → redirect naar `/profiel-aanvullen`
   - Alleen bij portal/admin routes (niet bij publieke pagina's)

5. **Login pagina update** — voeg SocialAuthButtons toe aan `/inloggen`

6. **Registreer pagina update** — voeg SocialAuthButtons toe aan `/registreren`

### Buiten scope

- Supabase Dashboard provider-configuratie (handmatige stap — client ID/secrets instellen)
- LinkedIn/GitHub OAuth app registratie (handmatige stap)

## Technisch ontwerp

### Supabase OAuth flow (PKCE)

```
User clicks "Login met Google"
  → supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/auth/callback' } })
  → Supabase redirects to Google
  → Google redirects back to Supabase
  → Supabase redirects to /auth/callback?code=xxx
  → Callback route exchanges code for session
  → Check profiles.company_name
    → null → redirect /profiel-aanvullen
    → filled → redirect /dashboard (or /admin)
```

### Nieuwe bestanden

| Bestand | Beschrijving |
|---------|-------------|
| `src/app/auth/callback/route.ts` | OAuth callback — PKCE code exchange + redirect |
| `src/components/auth/SocialAuthButtons.tsx` | 4 OAuth knoppen (client component) |
| `src/app/(auth)/profiel-aanvullen/page.tsx` | Tussenstap bedrijfsgegevens na eerste OAuth |

### Gewijzigde bestanden

| Bestand | Wijziging |
|---------|-----------|
| `src/app/(auth)/registreren/page.tsx` | SocialAuthButtons + divider toevoegen |
| `src/app/(auth)/inloggen/page.tsx` | SocialAuthButtons + divider toevoegen |
| `src/middleware.ts` | Profiel-aanvullen redirect logica |

### SocialAuthButtons component

```tsx
// Client component met 4 knoppen
// Props: mode ("login" | "register") voor tekst-variatie
// Elke knop roept signInWithOAuth aan met de juiste provider
// redirectTo: window.location.origin + '/auth/callback'
```

### Provider-configuratie (handmatig in Supabase Dashboard)

| Provider | Dashboard pad | Vereist |
|----------|--------------|---------|
| Google | Authentication > Providers > Google | Client ID + Client Secret van Google Cloud Console |
| LinkedIn (OIDC) | Authentication > Providers > LinkedIn (OIDC) | Client ID + Client Secret van LinkedIn Developer |
| GitHub | Authentication > Providers > GitHub | Client ID + Client Secret van GitHub Settings |

### Callback redirect URL voor alle providers

```
https://wwfloeinidmepoclhedw.supabase.co/auth/v1/callback
```

Dit moet als "Authorized redirect URI" worden ingesteld bij elk OAuth provider.

### Profielbehoud bij OAuth

Supabase creëert automatisch een `auth.users` rij bij eerste OAuth login. De `profiles` tabel wordt aangemaakt via een database trigger (`handle_new_user`). De trigger moet `first_name` en `last_name` vullen uit `raw_user_meta_data`:

- Google: `full_name`, `given_name`, `family_name`
- LinkedIn: `full_name`, `given_name`, `family_name`
- GitHub: `full_name`, `user_name`

## Taaklijst

1. Maak `SocialAuthButtons.tsx` component
2. Maak `auth/callback/route.ts` (PKCE code exchange)
3. Maak `profiel-aanvullen/page.tsx`
4. Update `registreren/page.tsx` — voeg social buttons + divider toe
5. Update `inloggen/page.tsx` — voeg social buttons + divider toe
6. Update `middleware.ts` — profiel-aanvullen redirect
7. Verifieer: OAuth flow werkt end-to-end
8. Verifieer: profiel-aanvullen stap toont en slaat op

## Definition of Done

- [ ] SocialAuthButtons component met 3 providers (Google, LinkedIn, GitHub)
- [ ] OAuth callback route verwerkt PKCE flow correct
- [ ] Profiel-aanvullen pagina toont na eerste OAuth-login
- [ ] Social buttons zichtbaar op zowel /registreren als /inloggen
- [ ] Bestaande email/wachtwoord registratie werkt nog steeds
- [ ] Middleware redirect naar profiel-aanvullen wanneer bedrijfsgegevens ontbreken
- [ ] Dark-gold thema consistent met rest van site

## Relevant Files

- `project/src/app/(auth)/registreren/page.tsx`
- `project/src/app/(auth)/inloggen/page.tsx`
- `project/src/app/(auth)/layout.tsx`
- `project/src/middleware.ts`
- `project/src/app/api/auth/register/route.ts`
- `CHANGELOG.md`
- `project/backlog.md`

## Notes

- Supabase providers moeten handmatig geconfigureerd worden in het Dashboard (Authentication > Providers). Dit kan niet via code.
- De `handle_new_user` trigger in Supabase moet checken of `raw_user_meta_data` de juiste velden bevat voor naamextractie.
- LinkedIn gebruikt OIDC in Supabase (niet de legacy OAuth2 flow).
