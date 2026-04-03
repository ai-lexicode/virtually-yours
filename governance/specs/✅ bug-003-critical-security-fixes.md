---
title: Critical Security Fixes
type: bug
status: implemented
priority: critical
size: M
created: 2026-04-04
spec: bug-003
slug: critical-security-fixes
audit: audit-report-001
---

# Critical Security Fixes

Addresses all CRITICAL findings from full-stack audit.

## Tasks

### C1: Rotate exposed API keys
- Revoke and regenerate: Stripe test keys, Resend API key, Docassemble API key
- Verify `.env` is in `.gitignore` (it is, but confirm no accidental commits)
- Update server `.env.local` on Hetzner with new keys
- Update GitHub secrets with new keys

### C2: Add Zod validation to profile PUT
- File: `src/app/api/profile/route.ts`
- Add Zod schema: first_name (max 100), last_name (max 100), company_name (max 200), kvk_number (8 digits), btw_number (pattern), phone (max 20)
- Return 400 on validation failure

### C3: Docassemble webhook HMAC verification
- File: `src/app/api/docassemble/webhook/route.ts`
- Add HMAC-SHA256 signature verification of request body
- Add `DOCASSEMBLE_WEBHOOK_SECRET` to `.env.example`

### C4: Move service role key out of Server Components
- Move DB queries from layout.tsx/page.tsx to API route handlers
- Files: `(portal)/layout.tsx`, `(portal)/downloads/page.tsx`, `(admin)/admin/page.tsx`, `(admin)/admin/bestellingen/page.tsx`
- Fetch from API routes instead

### C5: Handle email send failures in registration
- File: `src/app/api/auth/register/route.ts`
- If email fails, still create account but return warning to user
- Log email failure to console.error with context

### Cleanup
- Remove `src/app/api/debug/route.ts`
- Remove console.logs from `src/app/auth/callback/route.ts`

## Definition of Done
- All 5 critical issues resolved
- No API keys exposed in git
- All API inputs validated
- Debug endpoint removed
