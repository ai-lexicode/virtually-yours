---
title: Full-Stack Deep Audit
type: plan
status: draft
priority: high
size: XL
created: 2026-04-04
spec: plan-001
slug: full-stack-audit
---

# Full-Stack Deep Audit — Virtually Yours

## Objective

Comprehensive audit of the entire application: code quality, security, performance, SEO, accessibility, UX, and infrastructure. Output: prioritized findings report + individual specs for each actionable fix.

## Scope

| Area | What to audit |
|------|---------------|
| Security | Auth flows, API routes, env vars, headers, OWASP top 10, RLS policies, input validation |
| Code quality | Dead code, error handling, TypeScript strictness, component architecture, DRY violations |
| Performance | Bundle size, image optimization, caching, database queries, server-side rendering |
| SEO | Meta tags, OG tags, sitemap, robots.txt, structured data, canonical URLs |
| Accessibility | WCAG 2.1 AA, keyboard navigation, screen reader, color contrast, form labels |
| UX | Mobile responsiveness, loading states, error states, navigation flow, form UX |
| Infrastructure | Nginx config, SSL, deployment pipeline, monitoring, logging, backups |
| Dependencies | Outdated packages, known vulnerabilities, unused dependencies |
| Email | Template rendering, deliverability config, SPF/DKIM/DMARC |

## Audit Areas

### 1. Security Audit

- [ ] Auth: password policies, session handling, PKCE flow, OAuth callback security
- [ ] API routes: input validation (Zod), rate limiting, CORS, error exposure
- [ ] Supabase RLS: verify all tables have proper row-level security
- [ ] Service role key: usage audit — only used server-side, never exposed
- [ ] Headers: CSP missing, X-XSS-Protection, Referrer-Policy
- [ ] Cookies: HttpOnly, Secure, SameSite flags
- [ ] File uploads: if any, validate types and sizes
- [ ] SQL injection: Supabase client usage patterns
- [ ] Secrets: scan codebase for hardcoded secrets, check .gitignore
- [ ] Payment webhooks: signature verification (Stripe/Mollie)

### 2. Code Quality Audit

- [ ] TypeScript: strict mode violations, `any` types, missing types
- [ ] Error handling: unhandled promises, missing try-catch, silent failures
- [ ] Dead code: unused imports, unreachable code, unused components
- [ ] DRY: duplicated logic across routes/components
- [ ] Component architecture: proper client/server boundaries, props drilling
- [ ] API routes: consistent response format, proper HTTP status codes
- [ ] Middleware: logic correctness, edge cases
- [ ] Database queries: N+1 issues, unnecessary joins, missing indexes

### 3. Performance Audit

- [ ] Bundle analysis: large dependencies, tree-shaking, code splitting
- [ ] Images: format (WebP), lazy loading, responsive sizes, optimization
- [ ] Caching: static assets, API responses, Supabase queries
- [ ] Server components vs client components: unnecessary `use client`
- [ ] Font loading: preload, display swap, subset
- [ ] CSS: unused styles, Tailwind purge configuration
- [ ] Database: query performance, connection pooling

### 4. SEO Audit

- [ ] Meta tags: title, description per page
- [ ] Open Graph: og:title, og:description, og:image per page
- [ ] Sitemap.xml: exists, includes all public routes
- [ ] Robots.txt: exists, proper directives
- [ ] Structured data: JSON-LD for organization, products, FAQ
- [ ] Canonical URLs: set on all pages
- [ ] URL structure: clean, semantic, no query params on content pages
- [ ] Internal linking: proper anchor text, no broken links
- [ ] Hreflang: Dutch language declaration

### 5. Accessibility Audit

- [ ] Semantic HTML: proper heading hierarchy, landmark regions
- [ ] Form labels: all inputs have associated labels
- [ ] Alt text: all images have descriptive alt attributes
- [ ] Color contrast: WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] Keyboard navigation: all interactive elements focusable and operable
- [ ] Focus management: visible focus indicators, logical tab order
- [ ] ARIA: proper roles, labels, live regions
- [ ] Skip navigation: skip-to-content link

### 6. UX Audit

- [ ] Mobile: responsive at 320px, 375px, 768px, 1024px breakpoints
- [ ] Loading states: skeleton/spinner for async operations
- [ ] Error states: user-friendly error messages, recovery options
- [ ] Empty states: proper messaging when no data
- [ ] Navigation: intuitive flow, breadcrumbs, back navigation
- [ ] Forms: validation feedback, submit states, success confirmation
- [ ] CTAs: clear call-to-action hierarchy, button states

### 7. Infrastructure Audit

- [ ] Nginx: buffer sizes, timeouts, gzip, security headers
- [ ] SSL: certificate validity, grade (SSL Labs)
- [ ] Deployment: CI/CD robustness, rollback strategy, env vars in build
- [ ] Monitoring: error tracking, uptime monitoring, alerting
- [ ] Logging: structured logging, log rotation, accessible logs
- [ ] Backups: database backup strategy, recovery testing

### 8. Dependencies Audit

- [ ] `npm audit`: known vulnerabilities
- [ ] Outdated: major version gaps, unmaintained packages
- [ ] Unused: installed but not imported
- [ ] License: compliance check

### 9. Email Audit

- [ ] Template rendering: cross-client testing (Gmail, Outlook, Apple Mail)
- [ ] DNS: SPF, DKIM, DMARC records for virtually-yours.nl
- [ ] From address: consistent, reply-to configured
- [ ] Unsubscribe: required headers/links
- [ ] Deliverability: Resend domain verification status

## Output

1. **Audit Report** — `project/specs/audit-report-001.md` with categorized findings
2. **Individual Specs** — one `⬜ bug-NNN` or `⬜ chore-NNN` per actionable finding
3. **Priority Matrix** — critical/high/medium/low classification

## Definition of Done

- All 9 audit areas completed with documented findings
- Each finding classified by severity and effort
- Actionable findings converted to individual specs
- Audit report delivered with executive summary
