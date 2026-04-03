---
title: Email Compliance & Hardening
type: chore
status: implemented
priority: high
size: S
created: 2026-04-04
spec: chore-004
slug: email-compliance
audit: audit-report-001
---

# Email Compliance & Hardening

Addresses email findings from audit (H7, H8).

## Tasks

### Unsubscribe Headers (H7)
- Add `List-Unsubscribe` and `List-Unsubscribe-Post` headers to all transactional emails
- Add unsubscribe link in email footer template

### Dynamic URLs (H8)
- Replace hardcoded URLs in `EmailLayout.tsx` with `NEXT_PUBLIC_SITE_URL`
- Verify LOGO_URL and SITE_URL use env vars with fallback

## Definition of Done
- All emails include List-Unsubscribe header
- Email footer has unsubscribe link
- No hardcoded production URLs in email templates
