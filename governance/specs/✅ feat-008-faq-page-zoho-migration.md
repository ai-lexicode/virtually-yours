---
spec: feat-005
type: feature
status: implemented
approved: 2026-04-03T14:32
implemented: 2026-04-03T15:00
modified: 2026-04-03T15:00
priority: high
size: medium
created: 2026-04-03
preflight: 2026-04-03T14:30
preflight_rounds: 1
preflight_verdict: pass
---

# feat-005: FAQ Page + Zoho Content Migration

## Problem

The old Zoho Commerce store (virtuallyyours.zohoecommerce.eu) contains 22 FAQ Q&A pairs that are not present in the new site. There is no FAQ page. Additionally, product content images from the old store should be integrated but the Zoho CDN is no longer serving them (404).

## Solution

1. Create a new `/faq` page with all 22 Q&A pairs from the Zoho store, organized in 3 categories
2. Add FAQ link to the navbar and footer
3. Add placeholder infrastructure for product images on document detail pages (ready for when images are sourced)

## Scope

### FAQ Content (22 Q&A pairs)

#### Tarieven en Bestellingen (9 items)

| # | Question |
| --- | --- |
| 1 | Kan ik een spoedopdracht plaatsen? |
| 2 | Hoe kan Virtually Yours zo goedkoop zijn? |
| 3 | Kan ik een offerte aanvragen? |
| 4 | Kan ik 50% aanbetalen? |
| 5 | Ik heb een kortingscode, waar vul ik deze in? |
| 6 | Bieden jullie ook adviesgesprekken aan? |
| 7 | Kunnen jullie mijn bestaande documenten controleren? |
| 8 | Wat kost volledig maatwerk? |
| 9 | Kan ik annuleren of retourneren? |

#### Juridische Documenten (10 items)

| # | Question |
| --- | --- |
| 1 | In hoeverre worden de documenten op maat gemaakt? |
| 2 | Hoe weet ik of de documenten geschikt zijn voor mij? |
| 3 | Waarom heb ik het Starterspakket nodig? |
| 4 | Hoe zit het met schijnzelfstandigheid? |
| 5 | Mag ik onderhandelen over mijn Algemene Voorwaarden? |
| 6 | Ik verwerk geen persoonsgegevens, heb ik dan toch een Verwerkersovereenkomst nodig? |
| 7 | Is het wettelijk verplicht om AV/OvO te hebben? |
| 8 | Ik heb nog geen website, wat nu? |
| 9 | Hoe weet ik welke cookies mijn website plaatst? |
| 10 | Hoe vaak moeten documenten worden bijgewerkt? |

#### Samenwerkingen (3 items)

| # | Question |
| --- | --- |
| 1 | Kan ik partner of affiliate worden? |
| 2 | Kan ik bij Virtually Yours werken? |
| 3 | Kan ik jullie inhuren als Juridisch VA? |

### FAQ Answers (full content)

**Tarieven en Bestellingen:**

1. **Spoedopdracht:** Ja, voor €25 extra. Levertijd 48 uur na invullen vragenlijst. Geen revisieronde bij spoedopdracht. Afhankelijk van beschikbaarheid.
2. **Goedkoop:** Beperkte maatwerk (geen volledig maatwerk), niche-focus (online dienstverleners), vragenlijsten i.p.v. telefonisch overleg, en automatisering.
3. **Offerte:** Ja, via het online formulier of per e-mail.
4. **50% aanbetaling:** Selecteer bij checkout. Na ontvangst van de aanbetaling ontvangt u de vragenlijst. Eindfactuur na levering.
5. **Kortingscode:** Invullen bij checkout. Codes gelden doorgaans alleen voor documenten, niet voor spoedopdrachten.
6. **Adviesgesprek:** Nee, om de prijzen laag te houden. Vragen per e-mail zijn welkom.
7. **Documenten controleren:** Meestal is het voordeliger om opnieuw te laten opstellen. Bij documenten van derden spelen auteursrechten.
8. **Volledig maatwerk:** Vanaf €199, gemiddeld €300-400. Op aanvraag via e-mail.
9. **Annuleren/retourneren:** Niet mogelijk, documenten worden op maat gemaakt.

**Juridische Documenten:**

1. **Op maat:** Beperkte maatwerk via vragenlijst. Specifieke wensen apart bespreken.
2. **Geschiktheid:** Eenmanszaak, geregistreerd in Nederland, B2B dienstverlening, Nederlandse klanten, opdrachtnemer-rol, online diensten, geen bijzondere eisen.
3. **Starterspakket:** De meeste starters hebben alle documenten nodig. Privacydocumenten zijn wettelijk verplicht.
4. **Schijnzelfstandigheid:** Documenten beperken het risico maar bieden geen garantie. De feitelijke werkwijze is bepalend. Wet DBA-kader (per 1 november 2024).
5. **Onderhandelen AV:** Vermijd waar mogelijk. De Belastingdienst kijkt naar wie de voorwaarden heeft opgesteld.
6. **Geen gegevensverwerking:** Alleen als u echt geen persoonsgegevens van klanten verwerkt. De meeste VA's verwerken wel gegevens.
7. **Wettelijke verplichting AV/OvO:** Nee, maar praktisch onmisbaar voor professionele dienstverlening.
8. **Geen website:** Cookie- en disclaimerdocumenten overslaan. Starterspakket blijft optimaal.
9. **Cookies identificeren:** Raadpleeg uw websitebouwer of gebruik Cookiebot.
10. **Bijwerken:** Jaarlijkse controle aanbevolen.

**Samenwerkingen:**

1. **Partner/affiliate:** Mogelijk (kortingscodes, affiliate-commissies, geïntegreerde aanbiedingen).
2. **Werken bij VY:** Freelance juristen welkom, neem contact op.
3. **Juridisch VA inhuren:** VY neemt geen nieuwe Juridisch VA-opdrachten meer aan.

### Product Images

The Zoho CDN (cdn3.zohoecommerce.com) returns 404 for all product images. Add an `image_url` field reference in the document detail page that renders when available. Images must be sourced manually by the user from backups or screenshots.

### Navigation Updates

- Add "FAQ" link to Navbar (between existing nav items)
- Add "FAQ" link to Footer

## Implementation plan

1. Create `/src/app/(public)/faq/page.tsx` with accordion-style Q&A sections
2. Add FAQ to Navbar navigation links
3. Add FAQ to Footer navigation links
4. Add SEO metadata (title, description) to FAQ page

## Out of scope

- Product image migration (CDN is down, user must source manually)
- Database-driven FAQ (hardcode for now, same pattern as blog posts)
- FAQ search functionality
- FAQ schema.org structured data (future SEO enhancement)

## Definition of Done

- [x] `/faq` page renders with all 22 Q&A pairs in 3 categories
- [x] Accordion/expandable sections for each Q&A
- [x] FAQ link in Navbar
- [x] FAQ link in Footer
- [x] Page styling matches app brand (dark theme, gold accents)
- [x] SEO metadata present
- [x] Mobile responsive
