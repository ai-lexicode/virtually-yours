---
spec: bug-001
title: "Mobile menu background missing — text unreadable"
type: bug
status: draft
priority: high
size: small
created: 2026-04-03
preflight: null
---

# bug-001: Mobile menu background missing — text unreadable

## Problem

On mobile devices, the fixed navbar at the top of the page uses a semi-transparent background (`bg-surface-container/85` = `#2a2a2a` at 85% opacity with `backdrop-blur-md`). When scrolling over light-colored content (hero images, white sections), the menu text (`text-muted`) becomes difficult or impossible to read due to insufficient contrast.

## Affected File

- `project/src/components/layout/Navbar.tsx` — line 21

## Root Cause

The navbar background opacity is set to 85% (`/85`) which, combined with light page content behind it, does not provide enough contrast for the `text-muted` colored navigation text on mobile screens where the blur effect may be less effective.

## Fix

Change the navbar background on mobile to be fully opaque, keeping the semi-transparent aesthetic on desktop where it works better:

**Option A (recommended):** Make the background fully opaque on mobile, keep semi-transparent on desktop:

```tsx
// Line 21 — change:
className="fixed top-0 left-0 right-0 z-50 bg-surface-container/85 backdrop-blur-md border-b border-card-border"

// To:
className="fixed top-0 left-0 right-0 z-50 bg-surface-container md:bg-surface-container/85 backdrop-blur-md border-b border-card-border"
```

This gives mobile a solid `#2a2a2a` background (always readable) while desktop retains the frosted-glass effect.

**Option B:** Make the background fully opaque everywhere:

```tsx
className="fixed top-0 left-0 right-0 z-50 bg-surface-container backdrop-blur-md border-b border-card-border"
```

## Scope

- Single file change (`Navbar.tsx`)
- No functional changes, only visual fix
- No new dependencies

## Definition of Done

- [ ] Mobile navbar text is readable over all page sections (hero, white content, images)
- [ ] Desktop retains frosted-glass aesthetic (if Option A)
- [ ] Visual regression check on mobile viewport (375px) across home, about, and documents pages
