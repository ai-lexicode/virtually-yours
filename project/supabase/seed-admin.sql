-- =============================================================================
-- Virtually Yours — Admin User Seed Script
-- =============================================================================
--
-- PURPOSE: Promote a registered user to admin role.
--
-- INSTRUCTIONS:
--
--   1. Go to Supabase Dashboard > Authentication > Users > Add User
--      - Email:    your-admin@email.com
--      - Password: (use a strong password, min 12 characters)
--      - Click "Create User"
--
--   2. Replace CHANGE_ME@email.com below with the email you just created.
--
--   3. Run this SQL in Supabase Dashboard > SQL Editor.
--
--   4. Verify: log in at /auth/login → you should be redirected to /admin.
--
-- WARNING: Verify you are connected to the correct database (dev/staging/prod)
--          before running this script.
-- =============================================================================

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'CHANGE_ME@email.com';
