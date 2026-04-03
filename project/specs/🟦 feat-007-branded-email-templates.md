---
spec: feat-007
type: feature
status: approved
approved: 2026-04-03T12:02
modified: 2026-04-03T12:02
priority: high
size: medium
created: 2026-04-03
preflight: 2026-04-03T12:00
preflight_rounds: 1
preflight_verdict: pass
---

# feat-007: Branded Email Templates

## Problem

All emails sent from the app use inline HTML strings with inconsistent branding. The header shows blue (`#046bd2`) instead of the app's gold (`#c89c6f`), there's no logo, and the button styling doesn't match the app's gradient buttons. Each email function duplicates the layout structure.

## Solution

Migrate from inline HTML strings to **React Email** components with a shared branded layout that matches the app's visual identity. All emails will use a single `EmailLayout` component with the logo, brand colors, and consistent typography.

## Scope

### Emails to migrate

| Email | Function | File |
|-------|----------|------|
| Account confirmation | `sendConfirmationEmail` | `src/lib/resend.ts` |
| Password reset | `sendPasswordResetEmail` | `src/lib/resend.ts` |
| Payment confirmation | `sendPaymentConfirmation` | `src/lib/resend.ts` |
| Document ready | `sendDocumentReady` | `src/lib/resend.ts` |
| Questionnaire reminder | `sendQuestionnaireReminder` | `src/lib/resend.ts` |
| Contact form (admin) | inline in route | `src/app/api/contact/route.ts` |
| Contact form (user confirmation) | inline in route | `src/app/api/contact/route.ts` |
| Document approved | inline in route | `src/app/api/admin/review/route.ts` |
| Document rejected | inline in route | `src/app/api/admin/review/route.ts` |
| Changes requested | inline in route | `src/app/api/admin/review/route.ts` |

### Brand tokens for emails

| Token | Value | Source |
|-------|-------|--------|
| Primary (gold) | `#c89c6f` | `globals.css` |
| Primary hover | `#d4a853` | `globals.css` |
| Background | `#1a1a1a` | `globals.css` |
| Card background | `#ffffff` | Email-specific (light for readability) |
| Text primary | `#1e293b` | Current emails |
| Text secondary | `#64748b` | Current emails |
| Button gradient | `linear-gradient(135deg, #c89c6f 0%, #d4a853 100%)` | App buttons |
| Logo URL | `https://virtually-yours.nl/images/logo-email.png` | Hosted asset |
| Font stack | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Email-safe |

### Components to create

| Component | Purpose |
|-----------|---------|
| `EmailLayout` | Shared wrapper: logo header, card body, footer with KvK/BTW/phone |
| `EmailButton` | Branded gold gradient CTA button |
| `EmailHeading` | Consistent h1 styling |
| `EmailText` | Body text with correct color/line-height |

### File structure

```
src/emails/
├── components/
│   ├── EmailLayout.tsx
│   ├── EmailButton.tsx
│   ├── EmailHeading.tsx
│   └── EmailText.tsx
├── ConfirmationEmail.tsx
├── PasswordResetEmail.tsx
├── PaymentConfirmationEmail.tsx
├── DocumentReadyEmail.tsx
├── QuestionnaireReminderEmail.tsx
├── ContactFormAdminEmail.tsx
├── ContactFormConfirmationEmail.tsx
├── DocumentApprovedEmail.tsx
├── DocumentRejectedEmail.tsx
└── ChangesRequestedEmail.tsx
```

## Implementation plan

1. Install `@react-email/components` dependency
2. Create shared components in `src/emails/components/`
3. Create individual email templates as React components
4. Update `src/lib/resend.ts` — use Resend's `react` prop (pass JSX directly, no `render()` needed)
5. Update `src/app/api/contact/route.ts` — replace inline HTML with React Email components; use shared `getResend()` from `src/lib/resend.ts` instead of local `new Resend()`
6. Update `src/app/api/admin/review/route.ts` — replace inline HTML with React Email components; use shared `getResend()` from `src/lib/resend.ts` instead of local `new Resend()`
7. Remove old `brandedHtml()` and `button()` helper functions
8. Export `getResend()`, `FROM`, and `SITE_URL` from `src/lib/resend.ts` for use by route handlers

## Out of scope

- Email preview dev server (`email dev`) — nice to have, separate chore
- Dark mode email variants
- Multilingual email support
- Email analytics/tracking

## Definition of Done

- [ ] All 10 emails use React Email components with shared layout
- [ ] Logo visible in email header
- [ ] Gold brand colors (`#c89c6f` / `#d4a853`) used consistently
- [ ] Gradient buttons match app styling
- [ ] Footer includes KvK, BTW, phone, website link
- [ ] No inline HTML strings remain for email content
- [ ] Existing email functionality unchanged (same recipients, subjects, content)
- [ ] Tested: send test emails for auth and transactional flows

## Preflight Log

| ID | Source | Category | What | Action |
| --- | --- | --- | --- | --- |
| D1 | A | 🟢 FIX | Missing `size` frontmatter field | Auto-fixed — set to `medium` |
| D2 | B | 🟡 NOTE | Step 4 said `render()` but Resend supports `react` prop directly | Applied — updated to use `react` prop |
| D3 | B | 🟡 NOTE | Contact/review routes create local `new Resend()` instead of shared `getResend()` | Applied — added steps 5-6 consolidation + step 8 for exports |
