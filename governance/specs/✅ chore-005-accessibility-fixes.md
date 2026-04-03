---
title: Accessibility & UX Fixes
type: chore
status: implemented
priority: medium
size: M
created: 2026-04-04
spec: chore-005
slug: accessibility-fixes
audit: audit-report-001
---

# Accessibility & UX Fixes

Addresses accessibility and UX findings from audit (H3, M9-M13, L5-L6).

## Tasks

### Accessibility
- H3: Add alt text to all images missing it (over-mij, contact pages)
- M9: Increase muted text color from #999 to #aaa for WCAG AA compliance
- M10: Add aria-expanded to mobile menu, aria-live to form status messages
- M11: Add htmlFor/id associations to all form label-input pairs

### UX
- M12: Add empty state components for dashboard, documents, orders
- M13: Add Suspense boundaries with skeleton loaders for async pages
- L5: Add client-side error boundaries for critical components
- L6: Create error.tsx and not-found.tsx global pages

## Definition of Done
- All images have alt text
- Color contrast meets WCAG AA (4.5:1 minimum)
- Forms have proper label associations
- Empty states shown when no data
- Global error and 404 pages exist
