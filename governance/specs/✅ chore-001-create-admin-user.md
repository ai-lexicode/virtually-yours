---
id: chore-001
type: chore
title: Create admin user seed script
status: implemented
priority: high
size: small
created: 2026-04-02
preflight: 2026-04-02T12:00
preflight_rounds: 1
preflight_verdict: pass
---

# chore-001: Create admin user seed script

## Goal

Create a one-time script to seed an admin user in Supabase, so the admin panel is accessible.

## Context

- Auth: Supabase Auth with `user_role` enum (`client`, `admin`)
- Trigger `handle_new_user()` auto-creates a profile with default role `client` on signup
- Admin access is gated by `public.is_admin()` function checking `profiles.role = 'admin'`
- No admin user exists yet

## Tasks

### T1: Create seed script

**File:** `project/supabase/seed-admin.sql`

SQL script that:

1. Creates a user in `auth.users` via `supabase_admin` role (or documents using Supabase Dashboard as alternative)
2. Updates the auto-created profile to `role = 'admin'`
3. Uses placeholder values (`CHANGE_ME`) for email and password

```sql
-- Step 1: Create user via Supabase Dashboard > Authentication > Users > Add User
--   Email: your-admin@email.com
--   Password: (strong password)
--
-- Step 2: Run this SQL in Supabase SQL Editor to promote to admin:
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'CHANGE_ME@email.com';
```

### T2: Add .env.example entry

Document that an admin user must be seeded after initial deployment.

Add comment in `project/supabase/README.md` or inline in seed script.

## Definition of Done

- [ ] Seed script exists at `project/supabase/seed-admin.sql`
- [ ] Script uses placeholder credentials (no real passwords)
- [ ] Script includes clear instructions for the two-step process
- [ ] Admin user can access `/admin` routes after running the script

## Risks

| Risk | Mitigation |
|------|------------|
| Hardcoded credentials | Placeholder values only, marked `CHANGE_ME` |
| Script run in wrong environment | Header comment warns to verify target DB |
