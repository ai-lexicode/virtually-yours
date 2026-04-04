# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Shared component library: ErrorBoundary, EmptyState, SkeletonCard, SkeletonTable (chore-006)
- `cn()` utility (`clsx` + `tailwind-merge`) at `project/src/lib/utils.ts`
- Admin dashboard loading skeleton via `loading.tsx`
- Social login with Google, LinkedIn, and GitHub OAuth (feat-005)
- Post-OAuth company details form (/profiel-aanvullen)
- All 5 document products linked to Docassemble interviews on da server
- Privacydocumenten package (privacydocsp05 v5.28.23): Privacyverklaring, Cookieverklaring, Verwerkersovereenkomst
- Start dispatch package (docassemble.start v1.0.6) installed on DA server
- Overeenkomst van Opdracht document product (€109, docassemble.opdrachtdocsp03 v3.30.27) (feat-004)
- DA package source stored in project/docassemble-packages/opdrachtdocsp03/
- SQL seed script for Supabase documents table
- AP-compliant cookie consent system with banner, personalization panel, and GTM integration (feat-003)
- Cookie preferences button in footer for revoking/changing consent
- Consent audit trail in localStorage (vy-consent-log)
- Google Tag Manager with Consent Mode v2 (default denied, granted on analytics consent)

### Changed

- Complete visual redesign using VY brand identity
- Migrated all content from WordPress (virtually-yours.nl)
- New reusable UI components (Button, Section, Badge, ServiceCard)
- Redesigned Navbar with logo image and improved mobile slide-out menu
- Redesigned Footer with Risha Smeding name/title, social icons, full business info
- Redesigned auth pages with branded split layout (VY blue panel + form)
- Updated homepage with services grid, trust bar, and real WordPress content
- Updated contact page with full address, working days, WhatsApp
- Updated metadata with favicon and OpenGraph tags
- Typography scale and focus ring in globals.css

### Added

- "Over mij" page with Risha Smeding's bio and profile photo
- "Nieuws" section with 4 blog post stubs from WordPress
- Downloaded WordPress images (logo, profile photo, banner icon, favicon)
- Initial project setup: cloned LexiCode stack and rebranded for Virtually Yours
- Virtually Yours color theme (blue #046bd2 on light #f9fafb)
- Docker configuration for Hetzner deployment
- 3 example Docassemble document configs (Privacyverklaring, Verwerkersovereenkomst, Algemene Voorwaarden)
- Environment template (.env.example) for VY services
- Stitch design system created with VY brand colors

- Initial project setup with ClawGuard governance (profile: controlled)
