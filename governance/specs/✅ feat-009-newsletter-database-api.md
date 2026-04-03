---
spec: feat-009
type: feature
status: implemented
implemented: 2026-04-04T19:00
title: Newsletter — database schema + core API
created: 2026-04-04
approved: 2026-04-04T18:30
priority: medium
size: medium
parent: umb-001
source: cubania/project (newsletter module)
ship: direct
preflight: 2026-04-04T18:30
preflight_rounds: 1
preflight_verdict: pass
---

# feat-009: Newsletter Database + Core API

## Doel

Database schema (Supabase migration), helper library en alle API routes voor het newsletter-systeem. Dit is de fundatie waar feat-010 (admin UI) en feat-011 (public UI) op bouwen.

## Scope

### In scope

#### 1. Supabase migration

**Nieuwe enums:**

```sql
CREATE TYPE newsletter_status AS ENUM ('draft', 'sending', 'sent');
CREATE TYPE newsletter_list_type AS ENUM ('general', 'list');
CREATE TYPE newsletter_recipient_status AS ENUM ('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained');
```

**Nieuwe tabellen:**

```sql
-- Subscriber preferences voor geregistreerde users
CREATE TABLE newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  general BOOLEAN DEFAULT true,
  bounce_count INT DEFAULT 0,
  unsubscribe_token UUID UNIQUE DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Niet-geregistreerde leads (import, formulier)
CREATE TABLE newsletter_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  source TEXT DEFAULT 'import',
  is_active BOOLEAN DEFAULT false,
  bounce_count INT DEFAULT 0,
  unsubscribe_token UUID UNIQUE DEFAULT gen_random_uuid(),
  locale TEXT DEFAULT 'nl',
  confirmed_at TIMESTAMPTZ,
  confirm_token UUID UNIQUE DEFAULT gen_random_uuid(),
  confirm_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Aangepaste verzendlijsten
CREATE TABLE newsletter_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lijst-lidmaatschap (user OF lead)
CREATE TABLE newsletter_list_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES newsletter_lists(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES newsletter_leads(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(list_id, user_id),
  UNIQUE(list_id, lead_id),
  CHECK (user_id IS NOT NULL OR lead_id IS NOT NULL)
);

-- Newsletter campagnes
CREATE TABLE newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  content JSONB DEFAULT '[]'::jsonb,
  status newsletter_status DEFAULT 'draft',
  list_type newsletter_list_type NOT NULL,
  list_id UUID REFERENCES newsletter_lists(id),
  sent_by UUID REFERENCES profiles(id),
  sent_at TIMESTAMPTZ,
  recipient_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Per-ontvanger tracking
CREATE TABLE newsletter_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id UUID NOT NULL REFERENCES newsletters(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_id UUID,
  resend_message_id TEXT UNIQUE,
  status newsletter_recipient_status DEFAULT 'queued',
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Click tracking
CREATE TABLE newsletter_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES newsletter_recipients(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT now()
);
```

**Indexes:**

```sql
CREATE INDEX idx_newsletter_subs_active ON newsletter_subscriptions(is_active);
CREATE INDEX idx_newsletter_leads_active ON newsletter_leads(is_active);
CREATE INDEX idx_newsletter_list_members_list ON newsletter_list_members(list_id);
CREATE INDEX idx_newsletters_status ON newsletters(status);
CREATE INDEX idx_newsletters_list_type ON newsletters(list_type);
CREATE INDEX idx_newsletters_sent_at ON newsletters(sent_at);
CREATE INDEX idx_newsletter_recipients_newsletter_status ON newsletter_recipients(newsletter_id, status);
CREATE INDEX idx_newsletter_recipients_email ON newsletter_recipients(email);
CREATE INDEX idx_newsletter_clicks_recipient ON newsletter_clicks(recipient_id);
```

**RLS policies:**

```sql
-- newsletter_subscriptions: users own row, admins all
-- newsletter_leads: admin only
-- newsletter_lists: admin only
-- newsletter_list_members: admin only
-- newsletters: admin only
-- newsletter_recipients: admin only (public track endpoints use service role)
-- newsletter_clicks: admin only
```

#### 2. Helper library (`src/lib/newsletter/helpers.ts`)

Port van cubania, aangepast voor Supabase client:

| Functie | Doel |
|---------|------|
| `getRecipients(listType, listId?)` | Haal ontvangers op: GENERAL (subscriptions) of LIST (list members). Filter bounced emails. |
| `injectTrackingPixel(html, recipientId)` | 1x1 pixel `<img>` voor `</body>` |
| `rewriteUrlsForTracking(html, recipientId)` | Herschrijf href URLs naar track/click endpoint |
| `resolveUnsubscribeUrl(userId, email)` | Zoek unsubscribe token (subscription of lead) |
| `getHardBouncedEmails()` | Set van gebounced emails voor filtering |

#### 3. Email rendering (`src/lib/newsletter/render-blocks-to-html.ts`)

Port van cubania `render-blocks-to-html.ts`, met Virtually Yours branding:

| Cubania | Virtually Yours |
|---------|-----------------|
| `#131313` (bg) | `#1a1a1a` |
| `#211c12` (card) | `#222222` |
| `#e4b54e` (gold) | `#c89c6f` |
| Logo URL | Virtually Yours logo |

Block types: `email-header`, `email-footer`, `email-text`, `email-image`, `email-button`, `email-divider`, `email-columns`

#### 4. Email send helper (`src/lib/newsletter/send.ts`)

```typescript
export async function sendNewsletter(params: {
  to: string;
  subject: string;
  html: string;
  unsubscribeUrl?: string;
}): Promise<{ id: string } | null>
```

- Resend client via bestaande `src/lib/resend.ts` of nieuwe wrapper
- List-Unsubscribe headers
- Plain-text fallback via `htmlToPlainText()`
- Return resendMessageId voor tracking

#### 5. Admin API routes (`src/app/api/admin/newsletter/`)

| Route | Methods | Functie |
|-------|---------|---------|
| `lists/route.ts` | GET, POST | CRUD lijsten |
| `lists/[id]/route.ts` | PUT, DELETE | Update/delete lijst |
| `lists/[id]/members/route.ts` | GET, POST, DELETE | Leden beheren |
| `lists/search-contacts/route.ts` | GET | Zoek users/leads |
| `audience/route.ts` | GET | Ontvanger count per list_type |
| `send/route.ts` | POST | Queue newsletter (status → sending, maak recipients) |
| `send/process/route.ts` | POST | Batch verzenden (50/batch) |
| `send/status/route.ts` | GET | Verzendvoortgang |
| `draft/route.ts` | GET, POST, DELETE | Concepten |
| `import/route.ts` | POST | CSV import (max 200 rijen) |
| `history/route.ts` | GET | Verzondgeschiedenis |
| `search/route.ts` | GET | Zoek newsletters |
| `stats/route.ts` | GET | Globale stats |
| `stats/[newsletterId]/route.ts` | GET | Per-newsletter stats |
| `stats/[newsletterId]/recipients/route.ts` | GET | Ontvangers per campagne |
| `subscribers/route.ts` | GET | Alle abonnees |
| `subscribers/export/route.ts` | GET | CSV export |

Elke admin route:
- Supabase auth check (admin role via `is_admin()`)
- Zod request validatie
- Service role client voor DB operaties

#### 6. Public API routes (`src/app/api/newsletter/`)

| Route | Methods | Functie |
|-------|---------|---------|
| `route.ts` | POST | Subscribe (user of lead met double opt-in) |
| `confirm/[token]/route.ts` | GET | Email bevestiging → activeer lead |
| `unsubscribe/[token]/route.ts` | GET, POST | Uitschrijven (subscription of lead) |
| `preferences/route.ts` | GET, PUT | Voorkeuren (auth required) |
| `track/open/[recipientId]/route.ts` | GET | 1x1 GIF, markeer OPENED |
| `track/click/[recipientId]/route.ts` | GET | Redirect + record click |

#### 7. Resend webhook (`src/app/api/webhooks/resend/route.ts`)

- Svix signature verificatie (HMAC-SHA256 via Node crypto — geen svix package nodig)
- Headers: `svix-id`, `svix-timestamp`, `svix-signature`
- Events: `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`, `email.complained`
- Bounce handling: hard bounce → direct deactiveren, soft bounce → increment count, deactiveer bij >= 3
- Env var: `RESEND_WEBHOOK_SECRET`

### Buiten scope

- Admin UI componenten (feat-010)
- Public subscribe formulier en unsubscribe pagina (feat-011)
- Email templates voor confirm/welcome (feat-011)
- Course/location/level audience targeting

## Adaptations from cubania

| Area | Change |
|------|--------|
| ORM | Prisma → Supabase client (`createServerClient`) |
| Auth | NextAuth `requireAdmin()` → Supabase `is_admin()` RLS + server check |
| CSRF | cubania CSRF layer → niet nodig (Next.js App Router) |
| Rate limiting | Redis-based → simple in-memory of skip (klein project) |
| Enums | PascalCase (`GENERAL`) → lowercase (`general`) in Supabase |
| IDs | cuid → UUID (Supabase standaard) |
| `list_type` | Remove COURSE, LOCATION, LEVEL |
| Branding | cubania kleuren → Virtually Yours kleuren in render-blocks-to-html |

## Definition of Done

- [ ] Migration draait zonder fouten op Supabase
- [ ] RLS policies actief voor alle tabellen
- [ ] Helper functies werken met Supabase client
- [ ] Alle admin API routes returnen correcte responses
- [ ] Alle public API routes werken (subscribe, confirm, unsubscribe, track)
- [ ] Resend webhook verwerkt delivery/bounce events correct
- [ ] Bounce management deactiveert na hard bounce of 3+ soft bounces
