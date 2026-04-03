---
spec: umb-001
type: umbrella
status: draft
title: Newsletter system — umbrella
created: 2026-04-04
priority: medium
size: large
source: cubania/project (newsletter module, stripped of course logic)
ship: direct
---

# umb-001: Newsletter System

## Doel

Volledig newsletter-systeem voor Virtually Yours: lijstbeheer, block-editor, open/click tracking, CSV import, double opt-in. Geporteerd van cubania, alleen lijst-gebaseerde audience (geen cursus/locatie/niveau).

## Sub-specs

| # | Spec | Title | Depends on | Size |
|---|------|-------|------------|------|
| 1 | feat-009 | Database + Core API | — | medium |
| 2 | feat-010 | Admin UI | feat-009 | medium |
| 3 | feat-011 | Public UI + Email | feat-009 | small |

## Execution order

Sequential: feat-009 → feat-010 + feat-011 (parallel)

## Definition of Done

- [ ] All 3 sub-specs implemented and verified
- [ ] Admin kan lijsten beheren, newsletters componeren en verzenden
- [ ] Public subscription met double opt-in
- [ ] Open/click tracking + stats dashboard
- [ ] CSV import + subscriber export
- [ ] Bounce management actief
