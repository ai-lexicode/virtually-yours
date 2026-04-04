---
id: chore-008
type: chore
status: approved
approved: 2026-04-04T12:00
modified: 2026-04-04T12:00
title: Verify document purchase and questionnaire flow (E2E)
created: 2026-04-04
priority: high
size: small
spec: chore-008
preflight: 2026-04-04T12:00
preflight_rounds: 1
preflight_verdict: pass
---

# chore-008: Verify document purchase and questionnaire flow (E2E)

## Context

The document purchase system is built and deployed. This chore verifies the full E2E flow works correctly in Stripe test mode: document selection, checkout, payment, questionnaire creation, question list loading, answer autosave, and document generation trigger.

## Goal

Manually verify the complete purchase-to-document-generation pipeline using Stripe test mode. Confirm all integrations (Stripe, Supabase, DocAssemble) function correctly with existing seed data.

## Prerequisites

- Dev environment running (`npm run dev`)
- Stripe test keys configured in `.env`
- Supabase with seeded documents and `document_questions` records
- DocAssemble instance accessible at `DOCASSEMBLE_URL`
- Stripe CLI running for local webhook forwarding: `stripe listen --forward-to localhost:3001/api/payments/webhook`
- Test user account (email/password or OAuth)

## E2E Verification Checklist

### Phase 1: Document catalog and checkout

| # | Step | Expected result | Status |
|---|------|-----------------|--------|
| 1.1 | Navigate to `/documenten` | All 5 documents visible with correct prices (EUR) | |
| 1.2 | Click a document (e.g. "Overeenkomst van Opdracht") | Detail page shows description, price (€109,00), "Bestellen" button | |
| 1.3 | Click "Bestellen" → redirected to `/checkout?doc=overeenkomst-van-opdracht` | Checkout page shows item title, subtotaal excl. BTW, BTW 21%, totaal | |
| 1.4 | Verify BTW calculation | Subtotaal + BTW = Total (BTW = total - total/1.21) | |
| 1.5 | Not logged in: click "Betalen" | Redirected to `/inloggen` with return URL | |
| 1.6 | Log in, return to checkout | User info loaded, item still shown | |

### Phase 2: Stripe test payment

| # | Step | Expected result | Status |
|---|------|-----------------|--------|
| 2.1 | Click "Betalen" | Order created in DB (status: `pending`), redirected to Stripe Checkout | |
| 2.2 | Verify Stripe Checkout page | Shows correct amount in EUR, iDEAL + card options, customer email | |
| 2.3 | Pay with test card `4242 4242 4242 4242` (any future exp, any CVC) | Payment succeeds, redirected to `/dashboard?payment=success&order={id}` | |
| 2.4 | Check `orders` table | Status changed to `questionnaire`, `paid_at` set, `payment_method` set | |
| 2.5 | Check `order_items` table | Item linked to correct document, correct `price_cents` and `btw_cents` | |
| 2.6 | Check `invoices` table | Invoice record created for order | |
| 2.7 | Check `activity_log` | `payment_received` entry with Stripe session metadata | |
| 2.8 | Check email (Resend) | Payment confirmation email received with order number and document title | |

### Phase 3: Questionnaire creation and questions

| # | Step | Expected result | Status |
|---|------|-----------------|--------|
| 3.1 | Check `questionnaires` table | Record created with `status: not_started`, linked to `order_item_id` | |
| 3.2 | Navigate to `/vragenlijsten` | Questionnaire visible in list with document title and 0% progress | |
| 3.3 | Click questionnaire → `/vragenlijsten/{id}` | Questions loaded, sorted by `sort_order` | |
| 3.4 | Verify questions match `document_questions` table | All questions for this `document_id` present with correct types, text, options | |
| 3.5 | Verify question types render correctly | `text`, `textarea`, `select`, `radio`, `checkbox` all functional | |
| 3.6 | Verify required/optional indicators | Required questions shown without "Optioneel", optional show "Optioneel" | |
| 3.7 | Verify help text renders | Questions with `help_text` show it below the title | |

### Phase 4: Answer saving and progress

| # | Step | Expected result | Status |
|---|------|-----------------|--------|
| 4.1 | Answer a question, wait 1.5s | Autosave fires, "Opgeslagen" indicator shows, `questionnaire_answers` updated | |
| 4.2 | Navigate away and return | Previously saved answers restored | |
| 4.3 | Check progress bar | Progress % matches (answered required / total required) * 100 | |
| 4.4 | Verify step dots | Answered questions show green dot, current shows elongated primary dot | |
| 4.5 | Click "Opslaan en later verdergaan" | Saves pending answers, redirects to `/vragenlijsten` | |
| 4.6 | Resume questionnaire | Resumes at first unanswered question | |

### Phase 5: Completion and document generation

| # | Step | Expected result | Status |
|---|------|-----------------|--------|
| 5.1 | Answer all required questions | Progress reaches 100%, "Voltooien" button enabled (green) | |
| 5.2 | Click "Voltooien" | Spinner: "Uw document wordt gegenereerd", redirects to `/vragenlijsten` after 2s | |
| 5.3 | Check `questionnaires` table | Status flow: `completed` → `generating` → `completed` (final) | |
| 5.4 | Check DocAssemble session | Session created, variables pushed, PDF attachment returned | |
| 5.5 | Check Supabase Storage (`documents` bucket) | PDF uploaded at `{order_number}/{slug}-{timestamp}.pdf` | |
| 5.6 | Check `generated_documents` table | Record with `storage_path`, `file_type: pdf`, `version: 1`, `status: generated` | |
| 5.7 | Check `orders` table | Status: `review` (if `requires_review: true`) or `completed` | |
| 5.8 | Check `activity_log` | `document_ready_for_review` or `document_auto_delivered` entry | |

### Phase 6: Error handling

| # | Step | Expected result | Status |
|---|------|-----------------|--------|
| 6.1 | Stripe: cancel payment at checkout | Redirected to checkout page with doc slug, order remains `pending` | |
| 6.2 | Stripe: use declined card `4000 0000 0000 0002` | Payment declined, user sees error on Stripe page | |
| 6.3 | Submit questionnaire with missing required fields | "Voltooien" button stays disabled | |
| 6.4 | Double-click "Voltooien" | Guard prevents double generation (`eq("status", "completed")` atomic update) | |

## Test Documents

Available documents in the system (from `docassemble-documents.ts` and seeds):

| Slug | Price | Interview | requires_review |
|------|-------|-----------|-----------------|
| `privacyverklaring-avg` | €109,00 | privacydocsp05 | Check DB |
| `verwerkersovereenkomst` | €99,00 | privacydocsp05 | Check DB |
| `algemene-voorwaarden` | €119,00 | opdrachtdocsp03 | Check DB |
| `overeenkomst-van-opdracht` | €109,00 | opdrachtdocsp03 | true |
| `cookieverklaring` | €39,00 | privacydocsp05 | Check DB |

**Recommended test document:** `overeenkomst-van-opdracht` — has seed data, known `requires_review: true`, fewest required fields (5).

## Stripe Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |
| iDEAL (test bank) | Success |

## Definition of Done

- [ ] All Phase 1-5 checklist items pass for at least one document
- [ ] Phase 6 error handling verified
- [ ] Any issues found are logged as bugs or fixed inline
- [ ] `document_questions` confirmed populated for all 5 documents (or gaps documented)
