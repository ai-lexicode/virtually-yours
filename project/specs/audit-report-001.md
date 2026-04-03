# Full-Stack Audit Report — Virtually Yours

**Date:** 2026-04-04
**Auditor:** Claude (automated deep audit)
**Scope:** Security, Code Quality, Performance, SEO, Accessibility, UX, Infrastructure, Dependencies, Email

---

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 5 |
| 🟡 HIGH | 9 |
| 🔵 MEDIUM | 19 |
| ⚪ LOW | 8 |
| **Total findings** | **41** |

**Overall Score: 68/100** — Solid foundation with good TypeScript practices and auth flow, but critical security gaps (exposed secrets, missing validation) and missing SEO infrastructure need immediate attention.

---

## 🔴 CRITICAL (5)

| # | Finding | File | Recommendation |
|---|---------|------|----------------|
| C1 | `.env` with real API keys committed to git (Stripe, Resend, Supabase, Docassemble) | `project/.env` | Revoke ALL keys immediately, remove from git history |
| C2 | Missing input validation on profile update — raw body without Zod | `src/app/api/profile/route.ts:33-71` | Add Zod schema for all profile fields |
| C3 | Missing webhook signature verification on Docassemble — only header API key | `src/app/api/docassemble/webhook/route.ts:10-12` | Implement HMAC signature verification |
| C4 | Service Role Key used in Server Components (serializable to client) | `src/app/(portal)/layout.tsx`, `(portal)/downloads/`, `(admin)/admin/` | Move to API routes only |
| C5 | Registration completes even if confirmation email fails silently | `src/app/api/auth/register/route.ts:71` | Return 500 on email failure or implement retry queue |

## 🟡 HIGH (9)

| # | Finding | File | Recommendation |
|---|---------|------|----------------|
| H1 | No rate limiting on auth endpoints (login, register, reset, resend) | `src/app/api/auth/*` | Implement sliding-window rate limiting |
| H2 | Missing sitemap.xml — critical for SEO | N/A | Create `src/app/sitemap.ts` |
| H3 | Missing alt text on 3+ images | `(public)/over-mij/page.tsx`, `contact/page.tsx` | Add descriptive alt attributes |
| H4 | N+1 query: `listUsers()` fetches ALL users to find one email | `src/app/api/auth/resend-confirmation/route.ts:18` | Use targeted lookup instead |
| H5 | Debug console.logs in production auth callback | `src/app/auth/callback/route.ts` | Remove or gate behind NODE_ENV |
| H6 | No error tracking service (Sentry, etc.) | N/A | Integrate error tracking |
| H7 | Missing unsubscribe headers in transactional emails (GDPR/CAN-SPAM) | `src/lib/resend.ts` | Add List-Unsubscribe headers |
| H8 | Hardcoded production URLs in email templates | `src/emails/components/EmailLayout.tsx:14-15` | Use NEXT_PUBLIC_SITE_URL env var |
| H9 | Deployment script lacks rollback — if restart fails, no recovery | `.github/workflows/deploy.yml:59-74` | Add health check + auto-rollback |

## 🔵 MEDIUM (19)

| # | Finding | Area |
|---|---------|------|
| M1 | Missing Content-Security-Policy header | Security |
| M2 | Missing CSRF protection on forms | Security |
| M3 | Custom HTML escape instead of DOMPurify | Security |
| M4 | Open redirect vulnerability on login redirect param | Security |
| M5 | Missing audit logging for sensitive operations (delete account, role change) | Security |
| M6 | Missing robots.txt | SEO |
| M7 | Missing structured data (JSON-LD) for Organization/Services | SEO |
| M8 | Missing metadata on 7 pages (contact, auth pages, checkout) | SEO |
| M9 | Color contrast borderline on muted text (#999 on #1a1a1a = 4.2:1) | Accessibility |
| M10 | Missing ARIA attributes (aria-expanded on mobile menu, aria-live on forms) | Accessibility |
| M11 | Missing form label id/htmlFor association | Accessibility |
| M12 | No empty states for dynamic lists (dashboard, documents) | UX |
| M13 | No loading skeletons for async data | UX |
| M14 | No health check endpoint for monitoring | Infrastructure |
| M15 | No structured logging (28x console.log/error) | Infrastructure |
| M16 | Missing env vars in .env.example (Stripe, GTM, webhook secret) | Infrastructure |
| M17 | Inconsistent error handling patterns across API routes | Code Quality |
| M18 | Unused `postgres` package in devDependencies | Dependencies |
| M19 | Mollie references remain in .env.example and DB column names | Dependencies |

## ⚪ LOW (8)

| # | Finding | Area |
|---|---------|------|
| L1 | Debug endpoint `/api/debug` exposes env info | Security |
| L2 | No hreflang tags for Dutch language | SEO |
| L3 | Double file extension: `profile-risha-premium.png.png` | Code Quality |
| L4 | Unsafe type assertions (`as unknown as`) in multiple API routes | Code Quality |
| L5 | No client-side error boundaries | UX |
| L6 | No error.tsx or not-found.tsx global pages | UX |
| L7 | No bundle analyzer configured | Performance |
| L8 | Fonts loaded via external Google Fonts instead of next/font | Performance |

---

## Positive Findings ✅

- Excellent TypeScript strictness — no `any` types found
- Zod validation on most API routes
- Stripe webhook signature verification correctly implemented
- Strong security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- Proper RLS-aware Supabase querying
- Good responsive design with mobile-first breakpoints
- Proper heading hierarchy and semantic HTML
- Visible focus indicators (CSS focus-visible)
- Clean URL structure
- Open Graph tags configured
- No TODO/FIXME/HACK comments in codebase
- .gitignore comprehensive
- package-lock.json committed

---

## Priority Matrix

### Sprint 1 — Immediate (Critical + High Security)
1. C1: Revoke and rotate ALL exposed API keys
2. C2: Add Zod validation to profile PUT endpoint
3. C3: Implement Docassemble webhook HMAC verification
4. C4: Move service role key out of Server Components
5. C5: Handle email send failures in registration
6. H5: Remove debug console.logs from auth callback
7. L1: Remove /api/debug endpoint

### Sprint 2 — High Priority
1. H1: Implement rate limiting on auth endpoints
2. H2: Create sitemap.ts
3. H6: Integrate error tracking (Sentry)
4. H7: Add unsubscribe headers to emails
5. H8: Use env vars in email templates
6. H9: Add health check + rollback to deployment
7. M6: Create robots.txt
8. M14: Add /api/health endpoint

### Sprint 3 — Medium Priority
1. H3: Fix missing alt text
2. H4: Fix N+1 listUsers query
3. M1-M5: Security improvements (CSP, CSRF, audit logging)
4. M7-M8: SEO improvements (JSON-LD, metadata)
5. M9-M11: Accessibility improvements
6. M12-M13: UX improvements (empty states, skeletons)

### Sprint 4 — Low Priority / Polish
1. M15-M19: Infrastructure and code cleanup
2. L2-L8: Polish items
