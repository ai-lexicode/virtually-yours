# Error Log

*Last updated: 2026-04-02*

> Non-critical errors, warnings, and issues. Logged for periodic review.

**Order:** Newest first.

## Entries

[2026-04-04T22:00] [WARNING] [security] Resend API key `re_XcVL7r6C...` is committed in `.env` (was rotated but old value still in git history). Production uses rotated key in `.env.local`. Consider adding `.env` to `.gitignore` or using placeholder values only. **User:** lexicode

<!-- entries below -->
<!-- clawguard-managed: errors-log v1 -->

[2026-04-02T09:57] [ERROR] [validate-gov] Pre-commit validation failed (2 issues) — duplicate spec number: feat-001, completed spec in project/specs/ (should be in governance/specs/): ✅ chore-001-create-admin-user.md — Resolution: manual fix required

[2026-04-03T04:21] [ERROR] [validate-gov] Pre-commit validation failed (1 issues) — duplicate spec number: feat-004 — Resolution: manual fix required

[2026-04-03T04:22] [ERROR] [validate-gov] Pre-commit validation failed (1 issues) — completed spec in project/specs/ (should be in governance/specs/): ✅ feat-007-branded-email-templates.md — Resolution: manual fix required

[2026-04-03T05:04] [ERROR] [validate-gov] Pre-commit validation failed (4 issues) — duplicate spec number: feat-004, duplicate spec number: feat-005, completed spec in project/specs/ (should be in governance/specs/): ✅ feat-004-branded-email-templates.md, completed spec in project/specs/ (should be in governance/specs/): ✅ feat-005-faq-page-zoho-migration.md — Resolution: manual fix required

[2026-04-04T00:20] [ERROR] [validate-gov] Pre-commit validation failed (1 issues) — duplicate spec number: chore-001 — Resolution: manual fix required

[2026-04-04T14:00] [ERROR] [auth] 502 Bad Gateway on OAuth callback — Two root causes: (1) Next.js standalone `request.url` resolves to `0.0.0.0:3001` causing redirect to unreachable host, (2) nginx `proxy_buffer_size` default (4KB) too small for Supabase JWT session cookies. **Fix:** Code: use `NEXT_PUBLIC_SITE_URL` for origin (bdc7f44). Server: nginx buffers increased to 128k/256k. **User:** lexicode

[2026-04-04T16:00] [INFO] [audit] Full-stack deep audit completed — 41 findings: 5 critical, 9 high, 19 medium, 8 low. Score: 68/100. Report: `project/specs/audit-report-001.md`. Specs created: bug-003, chore-002..005. Implemented: Zod profile validation, sitemap, robots, error pages, health endpoint, email URL fix. **User:** lexicode
