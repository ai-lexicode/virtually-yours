---
id: chore-006
type: chore
status: approved
title: UI shared components library
created: 2026-04-04
spec: chore-006-ui-shared-components
parent: umb-002
size: small
---

# chore-006: UI Shared Components

## Problem

No reusable shared component library exists. Components like error boundaries, empty states, and skeleton loaders are needed across admin and public pages but must be created from scratch each time.

## Solution

Create a shared components directory with 4 foundational components adapted from cubania's proven implementations, styled for the virtualy-yours dark theme.

## Scope

### In scope

| Component | Source reference | Adaptation |
|-----------|----------------|------------|
| ErrorBoundary | cubania `shared/ErrorBoundary.tsx` | Remove Sentry import (added later in chore-007), keep fallback UI, adapt to VY theme |
| EmptyState | cubania `shared/EmptyState.tsx` | Replace cubania brand colors with VY theme (`bg-[#1a1a1a]`, `border-card-border`, `text-primary`) |
| SkeletonCard | cubania `shared/SkeletonCard.tsx` | Minimal — uses `cn` utility + `animate-pulse`, adapt colors |
| SkeletonTable | cubania `shared/SkeletonTable.tsx` | Minimal — uses `cn` utility + `animate-pulse`, adapt colors |

### Out of scope

- Breadcrumbs (uses next-intl, cubania-specific)
- ScrollReveal (low value, CSS alternative)
- New components not in cubania source

## Relevant Files

| File | Action |
|------|--------|
| `project/src/components/shared/ErrorBoundary.tsx` | Create |
| `project/src/components/shared/EmptyState.tsx` | Create |
| `project/src/components/shared/SkeletonCard.tsx` | Create |
| `project/src/components/shared/SkeletonTable.tsx` | Create |
| `project/src/components/shared/index.ts` | Create — barrel export |
| `CHANGELOG.md` | Update |

## Implementation Plan

1. Create `project/src/components/shared/` directory
2. Implement ErrorBoundary — class component with `getDerivedStateFromError`, `componentDidCatch` (log to console, no Sentry yet), customizable `errorTitle`/`errorDescription`/`retryLabel` props, "Try again" reset button
3. Implement EmptyState — accepts Lucide icon, title, description, optional action button. Uses existing `Button` from `project/src/components/ui/Button.tsx` and `cn` utility
4. Implement SkeletonCard — configurable line count (default 3), `animate-pulse`, randomized widths
5. Implement SkeletonTable — configurable rows (default 5) and columns (default 4), full table structure
6. Create barrel `index.ts` exporting all 4 components
7. Integrate each component in at least 1 existing page:
   - ErrorBoundary → wrap admin dashboard (`project/src/app/(admin)/admin/page.tsx`)
   - EmptyState → newsletter history empty state (`project/src/components/admin/NewsletterHistory.tsx`)
   - SkeletonCard → admin dashboard loading state
   - SkeletonTable → newsletter subscribers loading state (`project/src/components/admin/NewsletterSubscribers.tsx`)

## Definition of Done

- [ ] 4 components created in `project/src/components/shared/`
- [ ] Barrel export in `index.ts`
- [ ] Each component used in at least 1 existing page
- [ ] Components render correctly with VY dark theme
- [ ] No Sentry dependency (placeholder console.error in ErrorBoundary)
- [ ] TypeScript types exported for all props
