---
title: SEO Infrastructure
type: chore
status: draft
priority: high
size: S
created: 2026-04-04
spec: chore-002
slug: seo-infrastructure
audit: audit-report-001
---

# SEO Infrastructure

Addresses missing SEO fundamentals from audit (H2, M6, M7, M8).

## Tasks

### Sitemap (H2)
- Create `src/app/sitemap.ts` with all public routes
- Include dynamic routes: `/documenten/[slug]`, `/nieuws/[slug]`
- Set changeFrequency and priority per route

### Robots.txt (M6)
- Create `src/app/robots.ts`
- Disallow: `/admin`, `/dashboard`, `/api/`, `/auth/`
- Allow: `/`
- Reference sitemap URL

### Structured Data (M7)
- Add JSON-LD to root layout: Organization schema
- Add JSON-LD to `/documenten`: Product schema
- Add JSON-LD to `/faq`: FAQPage schema

### Page Metadata (M8)
- Add metadata exports to: contact, inloggen, registreren, wachtwoord-vergeten, wachtwoord-resetten, profiel-aanvullen, checkout

## Definition of Done
- sitemap.xml accessible at /sitemap.xml
- robots.txt accessible at /robots.txt
- JSON-LD validates at schema.org validator
- All public pages have unique title + description
