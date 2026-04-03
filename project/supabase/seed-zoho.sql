-- Zoho Commerce Products Migration Seed Script
-- Extracted from: https://virtuallyyours.zohoecommerce.eu/

-- Insert standard categories if needed, but products are already placed below.

-- 1. Starterspakket VA (Bundle)
INSERT INTO public.bundles (
  title,
  slug,
  description,
  price_cents,
  is_active
) VALUES (
  'Starterspakket VA',
  'starterspakket-va',
  'Een pakket compleet voor de juridische basis van je online dienstverlening. Bevat: Algemene Voorwaarden, Overeenkomst van Opdracht, Privacyverklaring, Cookieverklaring, Disclaimer en Verwerkersovereenkomst. Inclusief gedetailleerde uitleg en 3 maanden nazorg.',
  31900,
  true
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price_cents = EXCLUDED.price_cents;

-- 2. Algemene Voorwaarden (B2B)
INSERT INTO public.documents (
  title,
  slug,
  description,
  category,
  price_cents,
  has_docassemble,
  requires_review,
  is_active,
  sort_order
) VALUES (
  'Algemene Voorwaarden (B2B)',
  'algemene-voorwaarden-b2b',
  'Duidelijke spelregels ter voorkoming van misverstanden. Dekt risico''s af over tarieven, betalingen, aansprakelijkheid, intellectueel eigendom en geheimhouding. Specifiek voor B2B online dienstverleners.',
  'commercieel',
  11900,
  true,
  true,
  true,
  1
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price_cents = EXCLUDED.price_cents, category = EXCLUDED.category;

-- 3. Overeenkomst van Opdracht
INSERT INTO public.documents (
  title,
  slug,
  description,
  category,
  price_cents,
  has_docassemble,
  requires_review,
  is_active,
  sort_order
) VALUES (
  'Overeenkomst van Opdracht',
  'overeenkomst-van-opdracht',
  'Formaliseert het project en voorkomt schijnzelfstandigheid. Legt de omvang van het werk en de wederzijdse verantwoordelijkheden vast.',
  'ondernemingsrecht',
  10900,
  true,
  true,
  true,
  2
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price_cents = EXCLUDED.price_cents, category = EXCLUDED.category;

-- 4. Opdrachtpakket VA (Bundle)
INSERT INTO public.bundles (
  title,
  slug,
  description,
  price_cents,
  is_active
) VALUES (
  'Opdrachtpakket VA',
  'opdrachtpakket-va',
  'Bevat de Algemene Voorwaarden (B2B) en de Overeenkomst van Opdracht gecombineerd voor een voordeligere prijs.',
  19900,
  true
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price_cents = EXCLUDED.price_cents;

-- 5. Privacy- en Cookieverklaring
INSERT INTO public.documents (
  title,
  slug,
  description,
  category,
  price_cents,
  has_docassemble,
  requires_review,
  is_active,
  sort_order
) VALUES (
  'Privacy- en Cookieverklaring',
  'privacy-en-cookieverklaring',
  'Legt uit hoe je met persoonsgegevens omgaat en welke cookies je gebruikt. Wettelijk verplicht volgens de AVG/GDPR.',
  'privacy',
  9500,
  true,
  false,
  true,
  3
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price_cents = EXCLUDED.price_cents, category = EXCLUDED.category;

-- 6. Verwerkersovereenkomst
INSERT INTO public.documents (
  title,
  slug,
  description,
  category,
  price_cents,
  has_docassemble,
  requires_review,
  is_active,
  sort_order
) VALUES (
  'Verwerkersovereenkomst',
  'verwerkersovereenkomst',
  'Wettelijk verplicht als je persoonsgegevens verwerkt in opdracht van klanten. Moet voor de start van de verwerking ondertekend zijn.',
  'privacy',
  9500,
  true,
  false,
  true,
  4
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price_cents = EXCLUDED.price_cents, category = EXCLUDED.category;

-- 7. Privacypakket VA (Bundle)
INSERT INTO public.bundles (
  title,
  slug,
  description,
  price_cents,
  is_active
) VALUES (
  'Privacypakket VA',
  'privacypakket-va',
  'Bevat de Privacy-/Cookieverklaring en de Verwerkersovereenkomst in één pakket.',
  15900,
  true
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price_cents = EXCLUDED.price_cents;

-- 8. Disclaimer
INSERT INTO public.documents (
  title,
  slug,
  description,
  category,
  price_cents,
  has_docassemble,
  requires_review,
  is_active,
  sort_order
) VALUES (
  'Disclaimer',
  'disclaimer',
  'Eenzijdige verklaring over de aansprakelijkheid van webcontent naar bezoekers toe.',
  'commercieel',
  4500,
  false,
  false,
  true,
  5
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price_cents = EXCLUDED.price_cents, category = EXCLUDED.category;

-- 9. Spoedaanvraag
INSERT INTO public.documents (
  title,
  slug,
  description,
  category,
  price_cents,
  has_docassemble,
  requires_review,
  is_active,
  sort_order
) VALUES (
  'Spoedaanvraag',
  'spoedaanvraag',
  'Optionele toeslag om concepten binnen 48 uur te ontvangen na het afronden van je vragenlijst (zonder revisieronde).',
  'commercieel',
  2500,
  false,
  false,
  true,
  6
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price_cents = EXCLUDED.price_cents, category = EXCLUDED.category;

-- 10. Juridisch Advies
INSERT INTO public.documents (
  title,
  slug,
  description,
  category,
  price_cents,
  has_docassemble,
  requires_review,
  is_active,
  sort_order
) VALUES (
  'Juridisch Advies (30 min)',
  'juridisch-advies-30-min',
  'Blok van 30 minuten voor gepersonaliseerd juridisch overleg of maatwerk advies.',
  'ondernemingsrecht',
  6000,
  false,
  false,
  true,
  7
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price_cents = EXCLUDED.price_cents, category = EXCLUDED.category;
