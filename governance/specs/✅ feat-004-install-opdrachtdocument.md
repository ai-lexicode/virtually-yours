---
spec: feat-004
type: feature
status: implemented
implemented: 2026-04-02T12:30
title: Installeer Opdrachtdocumenten (Overeenkomst van Opdracht) als eerste live document
created: 2026-04-02
approved: 2026-04-02T12:00
priority: high
size: medium
preflight: 2026-04-02T12:00
preflight_rounds: 1
preflight_verdict: pass
ship: direct
---

# feat-004: Installeer Opdrachtdocumenten (Overeenkomst van Opdracht)

## Doel

Installeer het Docassemble-pakket `docassemble.opdrachtdocsp03` (v3.30.27) op de Docassemble-server en registreer "Overeenkomst van Opdracht" als vierde documentproduct in Virtually Yours. Gebruikt een redirect-naar-Docassemble integratie als eerste stap — de klant koopt in VY en vult het interview in op `da.documentenportal.nl`.

## Beslissingen

| Beslissing | Keuze | Reden |
|------------|-------|-------|
| Integratiemodus | Redirect naar DA | Interview heeft 21 secties, 5 facturatiewijzen, branding/logo upload, review events — te complex voor API injection als eerste stap |
| Productnaam | Overeenkomst van Opdracht | Naam op webshop virtually-yours.nl |
| Prijs | €109 excl. BTW (10900 cents) | Prijs op virtually-yours.nl/documenten |

## Scope

### In scope

1. **Upload DA-pakket** naar `da.documentenportal.nl`
   - Kopieer pakket naar `project/docassemble-packages/opdrachtdocsp03/`
   - Upload via DA Playground of Package Management
   - Interview ID: `docassemble.opdrachtdocsp03:data/questions/Yaml_opdr_p03y30.yml`

2. **Registreer document in `docassemble-documents.ts`**
   - Slug: `overeenkomst-van-opdracht`
   - Titel: "Overeenkomst van Opdracht"
   - Beschrijving: productomschrijving
   - Prijs: 10900 (€109 excl. BTW)
   - Interview name: `docassemble.opdrachtdocsp03:data/questions/Yaml_opdr_p03y30.yml`
   - Required fields: minimaal (redirect-modus, niet API injection)

3. **Supabase `documents` tabel** — insert nieuwe rij
   - `slug`: `overeenkomst-van-opdracht`
   - `title`: `Overeenkomst van Opdracht`
   - `description`: productomschrijving
   - `price_cents`: 10900
   - `has_docassemble`: true
   - `docassemble_interview_id`: `docassemble.opdrachtdocsp03:data/questions/Yaml_opdr_p03y30.yml`
   - `requires_review`: true (eerste product, handmatige review)
   - `category`: `opdracht`

4. **Documentenpagina** — verifieer dat het document verschijnt op `/documenten`
   - De pagina leest uit Supabase `documents` waar `has_docassemble = true`
   - Geen codewijziging nodig als de query generiek is

5. **Seed script** — maak SQL seed voor reproduceerbaar toevoegen
   - `project/prisma/seeds/seed-document-opdrachtdocsp03.sql`

### Buiten scope

- API injection transformer (bestaat al in `docassemble-transform.ts`, activatie in latere fase)
- Simplified questionnaire in VY (latere fase — complexiteit 77 YAML files)
- Aanpassing van DA interview login/registratie flow
- Pakketten-pagina update (Opdrachtpakket €199)

## Technisch ontwerp

### Bestaande architectuur

Het systeem ondersteunt al Docassemble-integratie:
- `src/lib/docassemble.ts` — API client voor sessie-management
- `src/lib/docassemble-documents.ts` — statische document registry (3 docs)
- `src/lib/docassemble-transform.ts` — al een `transformOvereenkomstVanOpdracht` transformer
- `src/lib/generate-document.ts` — orchestrator (9-stappen pipeline)
- Supabase `documents` tabel met `docassemble_interview_id` kolom

### Wijzigingen

| Bestand | Wijziging |
|---------|-----------|
| `src/lib/docassemble-documents.ts` | Voeg 4e document config toe |
| `prisma/seeds/seed-document-opdrachtdocsp03.sql` | Nieuw: SQL insert voor documents tabel |

### DA-pakket structuur

```
docassemble.opdrachtdocsp03/
├── data/
│   ├── questions/           # 77 YAML files (interview flow)
│   │   ├── Yaml_opdr_p03y30.yml  # Main entry point
│   │   ├── interview-design_24v06.yml
│   │   └── opdr_*_v*.yml   # 21 sectie-YAMLs (latest versions)
│   ├── templates/           # 17 DOCX templates
│   │   ├── Docassemble_opdr_ovo_v34.docx  # Overeenkomst van Opdracht
│   │   ├── Docassemble_opdr_avw_v33.docx  # Algemene Voorwaarden
│   │   ├── Docassemble_opdr_opm_v08.docx  # Opmerkingenformulier
│   │   └── Docassemble_opdr_var_p03v07.docx  # Variabelen overzicht
│   └── static/
│       └── fotorishavy.png
```

### Interview secties (21)

| # | Sectie | YAML |
|---|--------|------|
| 0 | Review events | opdr_00_reviewevents_v10.yml |
| 1 | Start | opdr_01_start_v07.yml |
| 2 | Bedrijfsgegevens | opdr_02_gegevens_bedrijfsgegevens_v08.yml |
| 3 | Persoonsgegevens | opdr_03_gegevens_persoonsgegevens_v06.yml |
| 4 | Werkzaamheden | opdr_04_opdrachten_werkzaamheden_v07.yml |
| 5 | Samenwerking | opdr_05_opdrachten_samenwerking_v07.yml |
| 6 | IE | opdr_06_opdrachten_intellectueeleigendom_v07.yml |
| 7 | Overeenkomst | opdr_07_opdrachten_overeenkomst_v08.yml |
| 8 | Tarieven | opdr_08_facturatie_tarieven_v07.yml |
| 9 | Facturatie | opdr_09_facturatie_facturatie_v08.yml |
| 10 | Facturatiewijzen | opdr_10_facturatiewijzen_facturatiewijzen_v03.yml |
| 11 | Abonnement | opdr_11_facturatiewijzen_abonnement_v08.yml |
| 12 | Nacalculatie | opdr_12_facturatiewijzen_nacalculatie_v08.yml |
| 13 | Strippenkaart | opdr_13_facturatiewijzen_strippenkaart_v07.yml |
| 14 | Projectbasis | opdr_14_facturatiewijzen_projectbasis_v07.yml |
| 15 | Flatfee | opdr_15_facturatiewijzen_flatfee_v06.yml |
| 16 | Reiskosten | opdr_16_reiskosten_reiskosten_v06.yml |
| 17 | Logo | opdr_17_branding_logo_v03.yml |
| 18 | Huisstijl | opdr_18_branding_huisstijl_v02.yml |
| 19 | Opmerkingen | opdr_19_opmerkingen_v09.yml |
| 20 | Einde | opdr_20_einde_v10.yml |
| 21 | Review/resubmit | opdr_21_reviewresubmit_v01.yml |

## Taaklijst

1. Kopieer DA-pakket naar `project/docassemble-packages/opdrachtdocsp03/`
2. Voeg document config toe aan `docassemble-documents.ts`
3. Maak SQL seed script voor Supabase `documents` tabel
4. Voer seed script uit op Supabase
5. Verifieer: document verschijnt op `/documenten` pagina
6. Verifieer: detailpagina `/documenten/overeenkomst-van-opdracht` toont correct
7. Upload DA-pakket naar `da.documentenportal.nl` (handmatige stap)

## Definition of Done

- [ ] DA-pakket bronbestanden opgeslagen in repo (`project/docassemble-packages/`)
- [ ] Document config toegevoegd aan `docassemble-documents.ts`
- [ ] SQL seed script beschikbaar
- [ ] Document zichtbaar op `/documenten` pagina
- [ ] Detailpagina toont correcte beschrijving en prijs (€109)
- [ ] DA-pakket geupload naar `da.documentenportal.nl` (handmatig)
- [ ] Interview draait correct op DA-server (handmatige test)

## Relevant Files

- `project/src/lib/docassemble-documents.ts`
- `project/src/lib/docassemble-transform.ts` (bestaande transformer — niet gewijzigd)
- `project/src/lib/generate-document.ts` (bestaande orchestrator — niet gewijzigd)
- `project/src/app/(public)/documenten/page.tsx`
- `project/src/app/(public)/documenten/[slug]/page.tsx`
- `CHANGELOG.md`
- `project/backlog.md`

## Notes

- Het DA-pakket gebruikt interactief login (`kick_out_user` event). Bij redirect moet de klant een account aanmaken op `da.documentenportal.nl`.
- De bestaande `transformOvereenkomstVanOpdracht` in `docassemble-transform.ts` kan later geactiveerd worden voor API injection modus.
- Pakketversie: 3.30.27, auteur: Risha Smeding (LexiCode BV).
- DA-server: `da.documentenportal.nl` (DOCASSEMBLE_URL env var).
