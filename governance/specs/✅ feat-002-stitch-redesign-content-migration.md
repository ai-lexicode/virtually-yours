---
status: implemented
created: 2026-04-02T13:00
modified: 2026-04-02T14:30
preflight: 2026-04-02T13:12
preflight_rounds: 1
preflight_verdict: pass
approved: 2026-04-02T13:15
reviewed:
implemented: 2026-04-02T14:30
amends:
superseded_by:
sessions:
  plan:
  edits:
  implement:
ship: direct
size: large
type: feature
spec: feat-002
title: Stitch redesign and WordPress content migration
slug: stitch-redesign-content-migration
---

# Feature: Stitch redesign and WordPress content migration

## Description

Redesign the entire Virtually Yours application using Stitch MCP to generate professional designs, then implement them in React/Next.js components. Simultaneously migrate all text content and images from the existing WordPress site (virtually-yours.nl) into the new application.

The current app has functional pages but uses generic styling. This spec creates a cohesive visual identity based on the Virtually Yours brand and populates all pages with real content from the WordPress site, including Risha Smeding's bio, service descriptions, blog posts, and downloaded images.

**Content to migrate from virtually-yours.nl:**

- **Hero:** "Jouw juridische documenten op maat" — Freelance Juridisch VA
- **About Risha Smeding:** Freelance jurist, Legal Engineer & Juridisch VA. Studied Rechtsgeleerdheid at Open Universiteit. Specializes in legal documents for VAs, OBMs, SMMs. Also supports law firms remotely.
- **3 Services:** Juridisch VA (remote legal support), Juridische Documenten (custom legal docs), Coaching VAs (startup guidance)
- **Blog posts:** Wet VBAR, Cookiewet, Deliveroo-arrest, Overeenkomst van Opdracht
- **Contact:** Wikkestraat 68, Alphen aan den Rijn. Ma/di/vr, other days by appointment.
- **Images:** Logo (Asset-1.png), banner icon, profile photo, favicon

## Solution

1. Create Stitch design system with VY brand colors and generate screen designs for all page types
2. Download images from WordPress site to `public/images/`
3. Create reusable UI component library (Button, Card, Badge, Section) based on Stitch designs
4. Implement redesigned public pages with migrated WordPress content
5. Implement redesigned portal and admin pages with consistent design language
6. Add blog/nieuws section with migrated articles

## Relevant Files

### Modified Files
- `project/src/app/page.tsx` — homepage redesign with WordPress content
- `project/src/app/layout.tsx` — updated metadata, font loading
- `project/src/app/globals.css` — refined theme variables, typography scale
- `project/src/components/layout/Navbar.tsx` — redesigned navigation with logo image
- `project/src/components/layout/Footer.tsx` — redesigned footer with full WordPress content
- `project/src/components/layout/PortalSidebar.tsx` — redesigned portal sidebar
- `project/src/components/layout/AdminSidebar.tsx` — redesigned admin sidebar
- `project/src/components/ui/DocumentCard.tsx` — redesigned document card
- `project/src/app/(public)/documenten/page.tsx` — redesigned documents page
- `project/src/app/(public)/documenten/[slug]/page.tsx` — redesigned document detail
- `project/src/app/(public)/hoe-werkt-het/page.tsx` — redesigned with VY content
- `project/src/app/(public)/pakketten/page.tsx` — redesigned packages page
- `project/src/app/(public)/contact/page.tsx` — redesigned with full contact info + address
- `project/src/app/(public)/privacyverklaring/page.tsx` — styled privacy policy
- `project/src/app/(public)/algemene-voorwaarden/page.tsx` — styled terms
- `project/src/app/(auth)/inloggen/page.tsx` — redesigned login
- `project/src/app/(auth)/registreren/page.tsx` — redesigned registration
- `project/src/app/(portal)/dashboard/page.tsx` — redesigned dashboard
- `project/src/app/(admin)/admin/page.tsx` — redesigned admin dashboard

### New Files
- `project/public/images/logo.png` — downloaded VY logo
- `project/public/images/banner-icon.png` — downloaded banner icon
- `project/public/images/profile-risha.jpg` — downloaded profile photo
- `project/public/images/favicon.png` — downloaded favicon
- `project/src/components/ui/Button.tsx` — reusable button component
- `project/src/components/ui/Section.tsx` — reusable page section wrapper
- `project/src/components/ui/Badge.tsx` — status/category badge component
- `project/src/components/ui/ServiceCard.tsx` — service offering card
- `project/src/app/(public)/over-mij/page.tsx` — About Risha page (new route)
- `project/src/app/(public)/nieuws/page.tsx` — Blog listing page
- `project/src/app/(public)/nieuws/[slug]/page.tsx` — Blog detail page

### Always Touched
- `project/specs/⬜ feat-002-stitch-redesign-content-migration.md` — this spec
- `CHANGELOG.md` — changelog entry
- `project/backlog.md` — reconcile matching items
- `project/flow/state.yaml` — pipeline progress

## Scope

### In Scope
- Stitch design system creation and screen generation for all page types
- Download and integrate images from WordPress (logo, profile photo, favicon, banner)
- Create reusable UI components (Button, Section, Badge, ServiceCard)
- Redesign all public pages with WordPress content migration
- Redesign portal pages (dashboard, documents, downloads, invoices, settings)
- Redesign admin pages (dashboard, orders, review, customers)
- Redesign auth pages (login, register, forgot/reset password)
- Add "Over mij" page with Risha Smeding's full bio
- Add "Nieuws" section with 4 migrated blog post stubs
- Responsive design (mobile + desktop) for all pages
- Updated Navbar with logo image and improved mobile menu
- Updated Footer with complete WordPress content

### Out of Scope
- Blog CMS functionality (blog posts are static content, not a DB-backed system)
- Full blog article content migration (only titles, dates, and summaries — full articles remain on WordPress)
- New features or functionality changes — this is purely visual redesign + content
- Payment flow changes
- API changes
- Database schema changes

## Acceptance Criteria

1. Stitch design system exists with VY brand (primary #046bd2, bg #f9fafb)
2. VY logo image renders in Navbar (downloaded from WordPress)
3. Profile photo of Risha Smeding renders on "Over mij" page
4. Favicon updated to VY favicon
5. All public pages display real content from WordPress (not placeholder text)
6. "Over mij" page exists at `/over-mij` with full bio text
7. "Nieuws" page exists at `/nieuws` with 4 blog post cards
8. Contact page shows full address (Wikkestraat 68, Alphen aan den Rijn)
9. Footer shows Risha Smeding's name, title, social links, and business details
10. All pages are responsive (mobile-friendly layout)
11. Reusable components (Button, Badge, Section, ServiceCard) used consistently across pages
12. `npm run build` succeeds with zero errors
13. No placeholder text ("Lorem ipsum", "TODO", "placeholder") remains in any page

## Plan

IMPORTANT: Execute each step in order.

### Step 1: Stitch Design System and Screen Generation

- Use `mcp__stitch__create_design_system` with VY brand: primary #046bd2, secondary #045cb4, text #1e293b, bg #f9fafb, font system stack
- Use `mcp__stitch__create_project` for "Virtually Yours Redesign"
- Generate screens via `mcp__stitch__generate_screen_from_text`:
  - Homepage (hero with photo, services grid, how it works, popular docs, CTA)
  - About page (profile photo, bio, services detail)
  - Document catalog (grid with filter/categories)
  - Contact page (form + map placeholder + address)
  - Blog listing (card grid with dates and images)
  - User dashboard (stats cards, recent orders, quick actions)
  - Login/Register (split layout with branding)
  - Admin dashboard (stats overview, order table)
- Generate mobile variants via `mcp__stitch__generate_variants`
- Apply design system via `mcp__stitch__apply_design_system`
- **Fallback:** if Stitch MCP tools time out, use the brand colors and a clean professional design approach manually

### Step 2: Download WordPress Images

- Download logo: `curl -o project/public/images/logo.png "https://virtually-yours.nl/wp-content/uploads/2023/05/Asset-1.png"`
- Download banner icon: `curl -o project/public/images/banner-icon.png "https://virtually-yours.nl/wp-content/uploads/2023/05/banner-icon.png"`
- Download profile photo: `curl -o project/public/images/profile-risha.jpg "https://virtually-yours.nl/wp-content/uploads/2023/08/348870060_594270019382801_2921965156896286960_n.jpg"`
- Download favicon: `curl -o project/public/images/favicon.png "https://virtually-yours.nl/wp-content/uploads/2023/08/Virtually-Yours-Logo-C1_favicon.png"`
- Verify all downloads succeeded (file sizes > 0)

### Step 3: Create Reusable UI Components

- Create `project/src/components/ui/Button.tsx`: variant prop (primary, secondary, outline, ghost), size prop (sm, md, lg), as Link or button
- Create `project/src/components/ui/Section.tsx`: wrapper with consistent padding, optional title/subtitle, optional background color
- Create `project/src/components/ui/Badge.tsx`: variant prop mapping document categories to colors (privacy=teal, commercieel=amber, arbeidsrecht=blue, ondernemingsrecht=purple)
- Create `project/src/components/ui/ServiceCard.tsx`: icon, title, description, link — for homepage services grid

### Step 4: Redesign Layout Components

- Update `Navbar.tsx`: use downloaded logo image (`/images/logo.png`), clean link styling, improved mobile hamburger menu with slide-out panel, nav items: Home, Over mij, Documenten, Pakketten, Nieuws, Contact
- Update `Footer.tsx`: 4-column layout with Risha Smeding's name and title, document links, info links, full contact details (address, phone, email, KvK, BTW), social media icons (Facebook, LinkedIn, Instagram)
- Update `PortalSidebar.tsx`: consistent with new design system, cleaner iconography
- Update `AdminSidebar.tsx`: consistent with new design system
- Update `globals.css`: add typography scale classes, spacing utilities, refined color shades

### Step 5: Redesign Public Pages with WordPress Content

- `page.tsx` (Homepage): hero section with tagline "Jouw juridische documenten op maat", Risha's subtitle "Freelance Juridisch VA", CTA buttons, trust bar, services grid (3 ServiceCards), how it works section (4 steps), popular documents from DB, final CTA
- `over-mij/page.tsx` (NEW — About): profile photo, full bio text from WordPress, services detail, qualifications (Rechtsgeleerdheid Open Universiteit), work approach
- `documenten/page.tsx`: redesigned grid with category filtering
- `hoe-werkt-het/page.tsx`: step-by-step with icons matching Stitch design
- `pakketten/page.tsx`: redesigned pricing cards with bundle details
- `contact/page.tsx`: full address (Wikkestraat 68, Alphen aan den Rijn), working days (Ma/Di/Vr), phone, email, WhatsApp note
- `privacyverklaring/page.tsx` + `algemene-voorwaarden/page.tsx`: clean typographic styling
- `nieuws/page.tsx` (NEW): blog listing with 4 cards (Wet VBAR, Cookiewet, Deliveroo-arrest, Overeenkomst van Opdracht) — static content with title, date, summary
- `nieuws/[slug]/page.tsx` (NEW): blog detail page with article stub + "Lees het volledige artikel op onze blog" link to WordPress

### Step 6: Redesign Auth Pages

- `inloggen/page.tsx`: split layout — left side with VY branding/image, right side with login form
- `registreren/page.tsx`: same split layout pattern with registration form
- `wachtwoord-vergeten/page.tsx` + `wachtwoord-resetten/page.tsx`: clean centered form design

### Step 7: Redesign Portal and Admin Pages

- `dashboard/page.tsx`: redesigned stat cards with icons, cleaner order table, improved quick actions
- Portal pages (documenten-portal, downloads, facturen, instellingen, vragenlijsten): consistent card/table styling using new components
- Admin pages (admin dashboard, bestellingen, review, klanten): consistent with portal design, admin-specific color accents

### Step 8: Update Metadata and Favicon

- Update `layout.tsx`: link favicon to `/images/favicon.png`, update OpenGraph metadata
- Update `next.config.ts` if needed for image optimization config

### Step 9: Validation

- Run `cd project && npm run build` — verify zero errors
- Grep for placeholder text: `grep -ri "lorem\|placeholder\|TODO" project/src/app/` — verify zero results
- Verify all image files exist in `project/public/images/` and are non-zero size
- Verify new routes respond: `/over-mij`, `/nieuws`
- Verify responsive layout: check Tailwind responsive classes are present in all page components

## Notes

- The WordPress site uses Elementor + Astra theme — content is extracted from page text, not migrated technically
- Blog posts are added as static content stubs linking back to the WordPress site for full articles — no blog CMS is needed
- Risha Smeding is the sole operator — the "Over mij" page is personal, not corporate
- The site copyright shows "EHBOndernemen" which may be Risha's business entity — use "Virtually Yours" in the new site
- Images from WordPress may be large — consider running through image optimization
- The document catalog, packages, and checkout flow are data-driven from Supabase — only the visual design changes, not the data fetching logic

## Preflight Log
<!-- Written by /preflight. Rows with source "user" may be added manually for fixes applied after preflight feedback. -->

| ID | Category | What | Action | Source |
|----|----------|------|--------|--------|
