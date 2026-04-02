-- =============================================================================
-- Virtually Yours — Overeenkomst van Opdracht Document Seed
-- =============================================================================
--
-- PURPOSE: Add "Overeenkomst van Opdracht" to the documents table.
--
-- INSTRUCTIONS:
--   1. Run this SQL in Supabase Dashboard > SQL Editor.
--   2. Upload the DA package (docassemble.opdrachtdocsp03) to da.documentenportal.nl
--   3. Verify: the document appears on /documenten
--
-- WARNING: Verify you are connected to the correct database (dev/staging/prod)
--          before running this script.
-- =============================================================================

INSERT INTO public.documents (
  title,
  slug,
  description,
  category,
  price_cents,
  has_docassemble,
  docassemble_interview_id,
  requires_review,
  is_active,
  sort_order
) VALUES (
  'Overeenkomst van Opdracht',
  'overeenkomst-van-opdracht',
  'Een overeenkomst van opdracht op maat voor freelancers en VA''s. Inclusief facturatieafspraken, werkzaamheden, IE-rechten en algemene voorwaarden. Geschikt voor eenmanszaken en zzp''ers.',
  'opdracht',
  10900,
  true,
  'docassemble.opdrachtdocsp03:data/questions/Yaml_opdr_p03y30.yml',
  true,
  true,
  4
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  has_docassemble = EXCLUDED.has_docassemble,
  docassemble_interview_id = EXCLUDED.docassemble_interview_id,
  requires_review = EXCLUDED.requires_review,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;
