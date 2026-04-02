---
status: implemented
created: 2026-04-02T12:05
modified: 2026-04-02T12:25
preflight: 2026-04-02T12:20
preflight_rounds: 2
preflight_verdict: pass
approved: 2026-04-02T12:25
reviewed: 2026-04-02T12:10
implemented: 2026-04-02T13:30
amends:
superseded_by:
sessions:
  plan:
  edits:
  implement:
ship: direct
size: large
type: feature
spec: feat-001
title: Clone LexiCode stack for Virtually Yours
slug: clone-lexicode-virtually-yours
---

# Feature: Clone LexiCode stack for Virtually Yours

## Description

Clone the complete LexiCode legal document SaaS platform and rebrand it for Virtually Yours (virtually-yours.nl). LexiCode is a Next.js 16 application with Supabase, Mollie payments, Docassemble document generation, and Resend email — a proven production stack for selling custom legal documents online.

Virtually Yours is a juridisch VA business targeting online entrepreneurs, VAs, OBMs, and SMMs who need custom legal documents. The new platform replaces both the current WordPress site and external webshop (virtuallyyours.legalwebshop.nl).

**Business details:**
- Name: Virtually Yours
- Tagline: "Jouw juridische documenten op maat"
- Domain: virtually-yours.nl
- KvK: 76053881 | BTW: NL003038893B59
- Contact: +31 (0)6 18755103 | info@virtually-yours.nl

## Solution

1. Copy LexiCode source code (`/Users/djmulato/proyectos_ai/proyectos_ai/lexicode/project/src/`) into this project
2. Rebrand all visual elements: colors (#046bd2 primary, #045cb4 secondary, #1e293b dark, #f9fafb background), company name, metadata, email templates
3. Use Stitch MCP to generate responsive design screens (desktop + mobile) based on Virtually Yours branding
4. Configure Docker + standalone output for Hetzner deployment
5. Set up new Supabase instance (separate from LexiCode)
6. Prepare Docassemble integration with example legal documents for VA services
7. Configure environment and deployment scripts

## Relevant Files

### Source (LexiCode — read-only reference)
- `/Users/djmulato/proyectos_ai/proyectos_ai/lexicode/project/src/` — complete source to clone
- `/Users/djmulato/proyectos_ai/proyectos_ai/lexicode/project/package.json` — dependencies
- `/Users/djmulato/proyectos_ai/proyectos_ai/lexicode/project/next.config.ts` — Next.js config
- `/Users/djmulato/proyectos_ai/proyectos_ai/lexicode/project/tsconfig.json` — TypeScript config
- `/Users/djmulato/proyectos_ai/proyectos_ai/lexicode/project/.env.example` — env template

### New Files (to create in virtualy-yours)
- `project/package.json` — dependencies (copied + adapted)
- `project/next.config.ts` — Next.js config with security headers
- `project/tsconfig.json` — TypeScript configuration
- `project/postcss.config.mjs` — Tailwind 4 config
- `project/eslint.config.mjs` — ESLint rules
- `project/.env.example` — environment template for Virtually Yours
- `project/Dockerfile` — multi-stage Docker build for Hetzner
- `project/docker-compose.yml` — production compose with reverse proxy
- `project/.dockerignore` — Docker ignore rules
- `project/src/` — full source tree (cloned + rebranded)
- `project/src/app/globals.css` — Virtually Yours color theme
- `project/src/app/layout.tsx` — metadata, fonts, branding
- `project/src/lib/resend.ts` — email templates with VY branding
- `project/src/components/layout/Navbar.tsx` — VY navigation
- `project/src/components/layout/Footer.tsx` — VY footer with business info
- `project/src/lib/docassemble-documents.ts` — example VA document configs
- `CHANGELOG.md` — initial entry
- `project/backlog.md` — reconciled

### Always Touched
- `project/specs/⬜ feat-001-clone-lexicode-virtually-yours.md` — this spec
- `CHANGELOG.md` — initial changelog entry
- `project/backlog.md` — reconcile matching items
- `project/flow/state.yaml` — pipeline progress

## Scope

### In Scope
- Copy complete LexiCode source tree (58 .ts/.tsx files)
- Rebrand: colors, company name, tagline, contact info, metadata, email templates
- Stitch MCP design generation for desktop and mobile layouts
- Docker configuration for Hetzner standalone deployment
- New Supabase project setup instructions and .env.example
- Docassemble integration with 3 example documents (Privacyverklaring, Verwerkersovereenkomst, Algemene Voorwaarden — typical VA legal docs)
- Security headers (HSTS, CSP, X-Frame-Options etc.)
- Dutch language UI (matching current lexicode Dutch interface)

### Out of Scope
- Actual DNS migration from WordPress to new system (separate ops task)
- Mollie production account setup (requires business verification)
- Resend domain verification (requires DNS records)
- Supabase database schema creation (tables, RLS policies, triggers — requires separate migration spec)
- CI/CD pipeline configuration
- SEO optimization and content migration from WordPress
- Actual Docassemble interview .yml files (user uploads these separately — this spec only creates integration configs and example document type definitions)

## Acceptance Criteria

1. `npm run build` succeeds with zero errors in `project/` directory
2. `cd project && docker build .` succeeds and produces a working container image
3. All 15 API routes exist and user-facing responses (emails, error messages) reference Virtually Yours branding
4. `globals.css` uses VY color palette (#046bd2 primary, #045cb4 secondary, #1e293b dark, #f9fafb bg)
5. Email templates in `resend.ts` show "Virtually Yours" branding with blue theme
6. Navbar and Footer display VY business info (name, KvK, BTW, contact)
7. `.env.example` documents all required environment variables for VY
8. `Dockerfile` produces standalone Next.js build suitable for Hetzner
9. Stitch design system created with VY brand colors and applied to key screens
10. 3 example Docassemble document configs exist with VA-relevant legal document types
11. No references to "LexiCode" remain in any user-facing code or templates
12. Middleware protects same route groups as lexicode (portal, admin, auth redirects)

## Plan

IMPORTANT: Execute each step in order.

### Step 1: Project Bootstrap — Copy Config Files

- Copy `package.json` from lexicode, update: name → "virtually-yours", description → "Juridische documenten op maat voor online professionals"
- Copy `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`
- Create `.env.example` with all variables adapted for Virtually Yours (RESEND_FROM_EMAIL, NEXT_PUBLIC_SITE_URL, etc.)
- Run `npm install` in `project/`

### Step 2: Copy Source Tree

- Copy entire `src/` directory from lexicode to `project/src/`
- Verify file count matches (58 .ts/.tsx files)

### Step 3: Rebrand — Colors & Theme

- Update `project/src/app/globals.css`:
  - `--background: #f9fafb` (light theme, not dark like lexicode)
  - `--foreground: #1e293b`
  - `--primary: #046bd2`
  - `--primary-hover: #045cb4`
  - `--card: #ffffff`
  - `--card-border: #e2e8f0`
  - Remove dark theme variables, apply light professional theme
- Update font from Inter to system stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`)

### Step 4: Rebrand — Company Identity

- Update `project/src/app/layout.tsx`: title "Virtually Yours — Jouw juridische documenten op maat", metadata, favicon references
- Update `project/src/components/layout/Navbar.tsx`: logo text "Virtually Yours", navigation items (Home, Over mij, Documenten, Pakketten, Contact)
- Update `project/src/components/layout/Footer.tsx`: company info (KvK: 76053881, BTW: NL003038893B59, contact details, social links)
- Search and replace all "LexiCode" / "lexicode" references in source files with "Virtually Yours" / "virtually-yours"

### Step 5: Rebrand — Email Templates

- Update `project/src/lib/resend.ts`:
  - Company name: "Virtually Yours"
  - Sender: `Virtually Yours <noreply@virtually-yours.nl>`
  - Colors: blue (#046bd2) primary buttons instead of gold
  - Background: light (#f9fafb) instead of dark
  - Footer: VY contact info and links
- Update all 5 email templates (confirmation, password reset, payment, document ready, reminder)

### Step 6: Stitch Design Generation

- Use `mcp__stitch__create_design_system` with VY brand: primary #046bd2, secondary #045cb4, text #1e293b, bg #f9fafb, font system stack
- Use `mcp__stitch__create_project` for "Virtually Yours"
- Generate key screens via `mcp__stitch__generate_screen_from_text`:
  - Homepage (hero + services + CTA)
  - Document catalog page
  - Checkout page
  - User dashboard/portal
  - Questionnaire form
  - Login/Register pages
- Generate mobile variants via `mcp__stitch__generate_variants`
- Apply design system via `mcp__stitch__apply_design_system`
- **Fallback:** if Stitch MCP tools are unavailable, skip this step and apply branding manually via CSS/component updates (Steps 3-5 already cover core rebranding)

### Step 7: Docker Configuration

- Create `project/Dockerfile`:
  - Multi-stage build (deps → build → runner)
  - Node 22 Alpine base
  - Standalone output mode (already configured in next.config.ts)
  - Non-root user for security
  - Health check endpoint
  - Expose port 3000
- Create `project/docker-compose.yml`:
  - Next.js app service
  - Environment variable passthrough from `.env`
  - Restart policy: unless-stopped
  - Network configuration for Hetzner
- Create `project/.dockerignore`: node_modules, .next, .git, .env*

### Step 8: Docassemble Example Documents

- Create `project/src/lib/docassemble-documents.ts` with 3 example document configs:
  1. **Privacyverklaring** (Privacy Policy) — for VAs handling client data
  2. **Verwerkersovereenkomst** (Data Processing Agreement) — VA ↔ client
  3. **Algemene Voorwaarden** (Terms & Conditions) — for online service providers
- Update `project/src/lib/docassemble-transform.ts` variable mappings for VY document types
- Create example questionnaire field definitions for each document type

### Step 9: Content Pages

- Update public pages with VY content:
  - `project/src/app/page.tsx` — Homepage: hero section about juridische documenten voor online professionals
  - `project/src/app/(public)/hoe-werkt-het/page.tsx` — VY-specific flow description
  - `project/src/app/(public)/contact/page.tsx` — VY contact info (phone, email)
  - `project/src/app/(public)/algemene-voorwaarden/page.tsx` — placeholder for VY terms
  - `project/src/app/(public)/privacyverklaring/page.tsx` — placeholder for VY privacy policy
  - `project/src/app/(public)/documenten/page.tsx` — update catalog to show VY document types (Privacyverklaring, Verwerkersovereenkomst, Algemene Voorwaarden)

### Step 10: Validation

- Run `cd project && npm run build` — verify zero errors
- Run `cd project && docker build -t virtually-yours .` — verify image builds
- Grep for "lexicode" / "LexiCode" in `project/src/` — verify zero remaining references
- Verify all 15 API route files exist in `project/src/app/api/`
- Verify middleware protects correct route groups
- Verify `.env.example` contains all required variables

## Notes

- LexiCode uses a dark theme (gold on dark), Virtually Yours needs a light professional theme (blue on white) — this is a significant visual change
- The lexicode project is at `/Users/djmulato/proyectos_ai/proyectos_ai/lexicode/project/` (source files under `project/` subdirectory)
- Docassemble interview files (.yml) are NOT part of this spec — the user will upload those separately. This spec only creates the integration config and example document type definitions
- Hetzner deployment: the standalone Next.js output + Docker is the right approach. No need for PM2 since Docker handles process management
- Supabase database schema (tables, RLS policies, triggers) should be documented in a separate setup guide or migration script — out of scope for this spec but the .env.example covers all connection variables
- The current virtually-yours.nl WordPress site stays live until DNS is manually switched (out of scope)

## Preflight Log
<!-- Written by /preflight. Rows with source "user" may be added manually for fixes applied after preflight feedback. -->

| ID | Category | What | Action | Source |
| ---- | -------- | ---- | ------ | ------ |
| D1 | 🟢 FIX | Step 9 missing specific file paths for content pages | Added explicit paths for all 6 public pages | preflight |
| D2 | 🟢 FIX | AC #3 vague — not all API routes have user-facing branding | Clarified to "user-facing responses (emails, error messages)" | preflight |
| D3 | 🟡 NOTE | Step 6 Stitch MCP dependency — no fallback if tools unavailable | Added fallback clause: skip Stitch, apply branding manually via Steps 3-5 | preflight |
| D4 | 🟢 FIX | MD034 bare URL in Step 9 contact page description | Replaced URL with "(phone, email)" reference | preflight |
