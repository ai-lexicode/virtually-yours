---
id: feat-016
type: feature
status: in-progress
title: Dynamic blog system replacing static nieuws pages
created: 2026-04-04
spec: feat-016-blog-system
parent: umb-002
size: large
---

# feat-016: Blog System

## Problem

The current blog at `/nieuws/` consists of 4 hardcoded articles in JSX components. No admin UI exists to manage posts. Adding content requires developer intervention and a deploy.

## Existing State

- 4 static articles at `project/src/app/(public)/nieuws/[slug]/page.tsx` rendered via switch-like functions (ArticleWetVbar, ArticleCookiewet, ArticleDeliveroo, ArticleOvereenkomst)
- Categories: Arbeidsrecht, Privacy, Ondernemingsrecht
- Images in `project/public/images/blog/`
- No database tables, no admin UI, no API routes for blog

## Solution

Replace the static blog with a DB-driven system. Admin can create/edit/publish posts. Public pages keep the `/nieuws/` URL path for SEO continuity. Seed existing 4 articles into DB.

## Scope

### In scope

| Layer | Details |
|-------|---------|
| DB tables | `blog_categories` (id, name, slug), `blog_posts` (id, title, slug, content, excerpt, cover_image, status, published_at, category_id, author_id, meta_title, meta_description, created_at, updated_at) |
| Admin pages | `/admin/blog` (list + filters), `/admin/blog/new`, `/admin/blog/[id]` (edit), `/admin/blog/categories` |
| Public pages | Replace `/nieuws/` with DB-driven listing (pagination, category filter), `/nieuws/[slug]` from DB |
| API routes | Admin CRUD (posts + categories), public listing, RSS feed |
| Features | Markdown content with `react-markdown`, status (DRAFT/PUBLISHED/ARCHIVED), SEO fields, pagination (12/page), search |
| Data migration | Seed script converting 4 existing articles to DB rows |

### Out of scope

- AI blog generation (Anthropic SDK dependency — backlog)
- Comments system
- Social sharing buttons
- Image upload (use URL references to existing `/images/blog/`)

## Relevant Files

| File | Action |
|------|--------|
| `supabase/migrations/20260404000003_blog_schema.sql` | Create — blog_categories + blog_posts tables |
| `supabase/seed-blog.sql` | Create — seed 4 existing articles |
| `project/src/app/api/admin/blog/posts/route.ts` | Create — GET list + POST create |
| `project/src/app/api/admin/blog/posts/[id]/route.ts` | Create — GET/PUT/DELETE |
| `project/src/app/api/admin/blog/categories/route.ts` | Create — GET/POST |
| `project/src/app/api/admin/blog/categories/[id]/route.ts` | Create — GET/PUT/DELETE |
| `project/src/app/api/blog/posts/route.ts` | Create — public GET (published only) |
| `project/src/app/api/blog/rss/route.ts` | Create — RSS feed |
| `project/src/app/(admin)/admin/blog/page.tsx` | Create — post list |
| `project/src/app/(admin)/admin/blog/new/page.tsx` | Create — new post form |
| `project/src/app/(admin)/admin/blog/[id]/page.tsx` | Create — edit post |
| `project/src/app/(admin)/admin/blog/categories/page.tsx` | Create — category management |
| `project/src/components/admin/BlogPostEditor.tsx` | Create — form component |
| `project/src/components/admin/BlogPostList.tsx` | Create — list component |
| `project/src/components/admin/BlogCategoryManager.tsx` | Create — category CRUD |
| `project/src/app/(public)/nieuws/page.tsx` | Modify — replace static with DB-driven |
| `project/src/app/(public)/nieuws/[slug]/page.tsx` | Modify — replace hardcoded with DB fetch |
| `project/src/components/public/BlogCard.tsx` | Create — card for listing |
| `project/src/components/public/BlogPagination.tsx` | Create — pagination |
| `project/package.json` | Modify — add react-markdown |
| `CHANGELOG.md` | Update |

## Technical Details

### blog_posts status enum

```sql
CREATE TYPE blog_post_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
```

### Admin API authentication

All `/api/admin/blog/*` routes use existing Supabase auth + admin role check (same pattern as newsletter admin routes).

### Public listing query

```sql
SELECT p.*, c.name as category_name, c.slug as category_slug
FROM blog_posts p
LEFT JOIN blog_categories c ON p.category_id = c.id
WHERE p.status = 'PUBLISHED'
ORDER BY p.published_at DESC
LIMIT 12 OFFSET ?
```

### RSS feed

Standard RSS 2.0 XML at `/api/blog/rss` with `content-type: application/xml`. Include title, description, link, pubDate for each published post.

## Implementation Plan

1. Create Supabase migration: `blog_categories` + `blog_posts` tables with RLS policies (admin write, public read for published)
2. Create seed script: extract title, slug, content (convert JSX to markdown), excerpt, category, published_at from 4 existing articles
3. Install `react-markdown` + `@types/react-markdown`
4. Create admin API routes (posts CRUD + categories CRUD) following newsletter API patterns
5. Create public API route (published posts with pagination + category filter)
6. Create admin components: BlogPostEditor (markdown textarea, status select, category select, SEO fields), BlogPostList (table with filters), BlogCategoryManager
7. Create admin pages wiring components to API
8. Create public components: BlogCard, BlogPagination
9. Replace static `/nieuws/page.tsx` with DB-driven listing
10. Replace static `/nieuws/[slug]/page.tsx` with DB fetch + react-markdown render
11. Create RSS feed endpoint
12. Add blog link to admin navigation

## Definition of Done

- [ ] Admin can create, edit, publish, archive blog posts
- [ ] Admin can manage blog categories (CRUD)
- [ ] Public `/nieuws/` shows paginated DB-driven blog listing
- [ ] Public `/nieuws/[slug]` renders markdown content from DB
- [ ] 4 existing articles seeded in DB with correct categories
- [ ] RSS feed returns valid XML with published posts
- [ ] SEO metadata (meta_title, meta_description) renders in head
- [ ] Existing `/nieuws/` URLs continue to work (SEO continuity)
