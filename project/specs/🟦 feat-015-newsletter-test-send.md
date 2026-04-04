---
id: feat-015
type: feature
status: approved
title: Newsletter test send to admin
created: 2026-04-04
preflight: 2026-04-04T15:45
spec: feat-015-newsletter-test-send
---

# feat-015: Newsletter Test Send to Admin

## Problem

Admins cannot preview how a newsletter will look in an actual email client before sending it to all recipients. They risk sending newsletters with formatting issues, broken links, or content errors.

## Solution

Add a "Testmail versturen" button in the newsletter composer that sends the current newsletter to the logged-in admin's email address. The test email is rendered using the exact same pipeline as production sends (blocks → HTML → tracking pixel → URL rewriting → unsubscribe link) so the admin sees exactly what recipients will receive.

## Scope

### In scope

- "Testmail versturen" button in the composer action area
- New API endpoint `POST /api/admin/newsletter/send/test` 
- Uses the same rendering pipeline as the real send (renderBlocksToHtml, injectTrackingPixel, rewriteUrlsForTracking)
- Subject prefixed with `[TEST] ` to distinguish from production sends
- Toast confirmation on success/failure
- No newsletter or recipient records created in the database (fire-and-forget)

### Out of scope

- Sending test to arbitrary email addresses (only admin's own email)
- Preview in browser (this is a real email send)
- Tracking of test sends in stats

## Technical Plan

### Files to create

| File | Purpose |
|------|---------|
| `project/src/app/api/admin/newsletter/send/test/route.ts` | Test send API endpoint |

### Files to modify

| File | Change |
|------|--------|
| `project/src/components/admin/NewsletterComposer.tsx` | Add "Testmail versturen" button |

### API: POST /api/admin/newsletter/send/test

Request body (same schema as send, minus draftId):

```typescript
{
  subject: string,      // 1-200 chars
  content: EmailBlock[] // editor blocks
}
```

Logic:
1. `requireAdmin()` → get admin user
2. Get admin's email from Supabase auth user
3. Render HTML: `renderBlocksToHtml(content)`
4. Generate a fake recipientId (random UUID) for tracking pixel/URL rewriting
5. `injectTrackingPixel(html, fakeRecipientId)`
6. `rewriteUrlsForTracking(html, fakeRecipientId)`
7. Replace `{{unsubscribeUrl}}` with `#` (test email, no real unsubscribe)
8. `sendEmail({ to: adminEmail, subject: "[TEST] " + subject, html })`
9. Return `{ success: true }` or error

No database records created. No newsletter or recipient entries.

### UI: Composer button

Add between "Concept opslaan" and "Verzenden" buttons:

```
[Concept opslaan]
[Testmail versturen]  ← new button, outline style
[Verzenden]
```

- Disabled when `!canSend` (no subject or no blocks)
- Shows spinner while sending
- Shows toast: "Testmail verzonden naar {email}" on success

## Definition of Done

- [ ] "Testmail versturen" button visible in composer
- [ ] Button disabled when subject or blocks are empty
- [ ] Clicking sends the newsletter to the admin's email via Resend
- [ ] Email uses the same rendering pipeline as production sends
- [ ] Subject is prefixed with `[TEST] `
- [ ] No database records created for test sends
- [ ] Toast shows success/failure feedback
- [ ] Loading state shown during send
