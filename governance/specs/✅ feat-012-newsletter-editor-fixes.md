---
spec: feat-012
type: feature
status: implemented
implemented: 2026-04-04T22:00
approved: 2026-04-04T21:30
preflight: 2026-04-04T21:30
preflight_rounds: 1
preflight_verdict: pass
title: Newsletter editor fixes — image upload, header/footer, drafts, type sync
created: 2026-04-04
priority: high
size: medium
depends_on: feat-009
ship: direct
---

# feat-012: Newsletter Editor Fixes

## Doel

Fix critical mismatches in the newsletter editor and add missing image upload functionality. Currently: block types don't match between editor and renderer, drafts fail to save due to case mismatch, no image upload exists, and header/footer blocks are not editable.

## Scope

### In scope

#### 1. Block type synchronization (CRITICAL)

Editor produces `"heading"`, `"text"`, etc. Renderer expects `"email-header"`, `"email-text"`, etc.

File: `src/components/admin/EmailEditorShell.tsx`

- Change block type enum to: `"email-header" | "email-footer" | "email-text" | "email-image" | "email-button" | "email-divider"`
- Update all block creation, editing, and rendering logic
- Align block props with renderer expectations:

| Block | Editor props (current) | Renderer props (expected) | Fix |
|-------|----------------------|--------------------------|-----|
| text | `{ text }` | `{ text, fontSize, color, align }` | Add fontSize, color, align fields |
| image | `{ url, alt, align }` | `{ src, alt, width, align }` | Rename url→src, add width |
| button | `{ label, url, color }` | `{ text, url, bgColor, textColor }` | Rename label→text, color→bgColor, add textColor |

#### 2. Case normalization (CRITICAL)

File: `src/components/admin/NewsletterAudienceSelector.tsx`

- Change `"GENERAL" | "LIST"` → `"general" | "list"` in AudienceSelection type
- Update NewsletterComposer default state to lowercase

File: `src/components/admin/NewsletterComposer.tsx`

- Default listType: `"general"` (was `"GENERAL"`)
- Draft save/load uses lowercase consistently

#### 3. Header/footer blocks in editor

File: `src/components/admin/EmailEditorShell.tsx`

Add two new block types to the editor toolbar:

- `email-header`: logo URL + title input. Default: VY logo URL, empty title
- `email-footer`: text input + auto-injected unsubscribe placeholder. Default: company info

These blocks are pinned: header always first, footer always last. Cannot be moved or deleted — only edited.

Auto-insert default header and footer when creating a new newsletter.

#### 4. Image upload

New file: `src/app/api/admin/newsletter/upload/route.ts`

- POST multipart/form-data with image file
- Validate: max 2MB, types: jpeg, png, gif, webp
- Upload to Supabase Storage bucket `newsletter-images` (create if not exists)
- Return public URL
- Admin auth required

File: `src/components/admin/EmailEditorShell.tsx`

- Add file input button to image blocks (alongside URL input)
- On file select: upload via API, insert returned URL
- Show upload progress indicator

File: `src/lib/newsletter/render-blocks-to-html.ts`

- No changes needed — already uses `src` prop which will be the public URL

#### 5. Draft save/load fix

File: `src/components/admin/NewsletterComposer.tsx`

- Ensure draft save sends lowercase listType
- Ensure draft load restores lowercase listType
- Test save → reload → edit → send cycle

### Buiten scope

- Image cropping/resizing in browser
- Drag & drop image upload
- Image gallery/library
- Custom fonts in email editor

## Relevant Files

- `src/components/admin/EmailEditorShell.tsx`
- `src/components/admin/NewsletterComposer.tsx`
- `src/components/admin/NewsletterAudienceSelector.tsx`
- `src/app/api/admin/newsletter/upload/route.ts` (new)
- `src/lib/newsletter/render-blocks-to-html.ts` (verify, may not need changes)
- `src/app/api/admin/newsletter/draft/route.ts` (verify)

## Definition of Done

- [ ] Block types match between editor and renderer
- [ ] Block props align (text→fontSize/color/align, image→src/width, button→text/bgColor/textColor)
- [ ] Header block with logo editable in editor, pinned to top
- [ ] Footer block with unsubscribe text, pinned to bottom
- [ ] Image upload works: select file → upload → URL inserted
- [ ] Upload validates file size (2MB) and type (jpeg/png/gif/webp)
- [ ] Draft save works (lowercase listType, blocks persisted)
- [ ] Draft load restores all state correctly
- [ ] Full send test: compose → save draft → load draft → send → verify recipient receives email with correct HTML
- [ ] Supabase Storage bucket `newsletter-images` created with public read policy
