-- =============================================================================
-- Virtually Yours — Document Questions Seed
-- =============================================================================
--
-- PURPOSE: Populate document_questions for all 5 document types with DA integration.
--          Question keys match the transforms in docassemble-transform.ts.
--
-- INSTRUCTIONS:
--   1. Run AFTER schema.sql (documents must exist)
--   2. Run in Supabase Dashboard > SQL Editor
--
-- WARNING: Verify correct database (dev/staging/prod) before running.
-- =============================================================================

-- ============================================================
-- 1. Overeenkomst van Opdracht
-- ============================================================

INSERT INTO document_questions (document_id, sort_order, question_key, question_text, question_type, placeholder, options, is_required, help_text)
SELECT d.id, q.sort_order, q.question_key, q.question_text, q.question_type, q.placeholder, q.options, q.is_required, q.help_text
FROM documents d
CROSS JOIN (VALUES
  (1, 'opdrachtnemer_naam', 'Wat is uw bedrijfsnaam?', 'text', 'Bijv. VA Studio', NULL::text[], true, 'De naam waaronder u als opdrachtnemer opereert.'),
  (2, 'opdrachtnemer_kvk', 'Wat is uw KvK-nummer?', 'text', 'Bijv. 12345678', NULL, true, 'Uw inschrijvingsnummer bij de Kamer van Koophandel.'),
  (3, 'werkzaamheden', 'Welke werkzaamheden gaat u uitvoeren?', 'textarea', 'Beschrijf de werkzaamheden die u voor de opdrachtgever gaat uitvoeren...', NULL, true, 'Wees zo specifiek mogelijk over de aard van de werkzaamheden.'),
  (4, 'tarief', 'Wat is uw uurtarief (excl. BTW)?', 'text', 'Bijv. 55', NULL, true, 'Uw uurtarief in euro, exclusief BTW.'),
  (5, 'betaling_termijn', 'Wat is de gewenste betalingstermijn?', 'select', NULL, ARRAY['14 dagen', '30 dagen', '60 dagen'], true, NULL),
  (6, 'einddatum', 'Heeft de opdracht een einddatum?', 'date', NULL, NULL, false, 'Laat leeg voor een overeenkomst voor onbepaalde tijd.')
) AS q(sort_order, question_key, question_text, question_type, placeholder, options, is_required, help_text)
WHERE d.slug = 'overeenkomst-van-opdracht'
ON CONFLICT (document_id, question_key) DO UPDATE SET
  sort_order = EXCLUDED.sort_order,
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  placeholder = EXCLUDED.placeholder,
  options = EXCLUDED.options,
  is_required = EXCLUDED.is_required,
  help_text = EXCLUDED.help_text;

-- ============================================================
-- 2. Verwerkersovereenkomst
-- ============================================================

INSERT INTO document_questions (document_id, sort_order, question_key, question_text, question_type, placeholder, options, is_required, help_text)
SELECT d.id, q.sort_order, q.question_key, q.question_text, q.question_type, q.placeholder, q.options, q.is_required, q.help_text
FROM documents d
CROSS JOIN (VALUES
  (1,  'verwerker_bedrijfsnaam', 'Wat is uw bedrijfsnaam (verwerker)?', 'text', 'Bijv. VA Studio', NULL::text[], true, 'U bent de verwerker: degene die persoonsgegevens verwerkt namens de opdrachtgever.'),
  (2,  'verwerker_kvk', 'Wat is uw KvK-nummer?', 'text', 'Bijv. 12345678', NULL, true, NULL),
  (3,  'verwerker_adres', 'Wat is uw vestigingsadres?', 'text', 'Straat, huisnummer, postcode, plaats', NULL, true, NULL),
  (4,  'verwerker_contactpersoon', 'Wie is de contactpersoon bij u?', 'text', 'Voor- en achternaam', NULL, false, 'Optioneel. De persoon die aanspreekbaar is voor privacy-gerelateerde zaken.'),
  (5,  'verwerker_email', 'Wat is uw e-mailadres voor privacy-zaken?', 'text', 'privacy@uwbedrijf.nl', NULL, false, NULL),
  (6,  'verwerkingsverantwoordelijke_bedrijfsnaam', 'Wat is de bedrijfsnaam van uw opdrachtgever?', 'text', 'Bijv. Klant BV', NULL, true, 'De verwerkingsverantwoordelijke: uw opdrachtgever die bepaalt welke gegevens u verwerkt.'),
  (7,  'verwerkingsverantwoordelijke_kvk', 'Wat is het KvK-nummer van uw opdrachtgever?', 'text', 'Bijv. 87654321', NULL, true, NULL),
  (8,  'verwerkingsverantwoordelijke_adres', 'Wat is het vestigingsadres van uw opdrachtgever?', 'text', 'Straat, huisnummer, postcode, plaats', NULL, true, NULL),
  (9,  'verwerkingsverantwoordelijke_contactpersoon', 'Wie is de contactpersoon bij de opdrachtgever?', 'text', 'Voor- en achternaam', NULL, false, NULL),
  (10, 'verwerkingsverantwoordelijke_email', 'Wat is het e-mailadres van de opdrachtgever voor privacy-zaken?', 'text', 'privacy@klant.nl', NULL, false, NULL),
  (11, 'verwerkingsdoel', 'Waarvoor verwerkt u de persoonsgegevens?', 'textarea', 'Bijv. het beheren van de klantenadministratie, het versturen van nieuwsbrieven...', NULL, true, 'Beschrijf het doel waarvoor u persoonsgegevens verwerkt namens de opdrachtgever.'),
  (12, 'categorieen_betrokkenen', 'Van wie verwerkt u persoonsgegevens?', 'textarea', 'Bijv. klanten, medewerkers, websitebezoekers...', NULL, true, 'De categorieen personen van wie u gegevens verwerkt.'),
  (13, 'categorieen_persoonsgegevens', 'Welke soorten persoonsgegevens verwerkt u?', 'textarea', 'Bijv. naam, e-mailadres, telefoonnummer, adresgegevens...', NULL, true, NULL),
  (14, 'beveiligingsmaatregelen', 'Welke beveiligingsmaatregelen treft u?', 'textarea', 'Bijv. versleuteling, tweefactorauthenticatie, beveiligde cloudopslag...', NULL, true, 'Beschrijf de technische en organisatorische maatregelen die u neemt.'),
  (15, 'subverwerkers', 'Maakt u gebruik van subverwerkers?', 'textarea', 'Bijv. Google Workspace, Mailchimp, boekhouder...', NULL, true, 'Partijen die u inschakelt voor het verwerken van de persoonsgegevens. Typ "Nee" als u geen subverwerkers gebruikt.'),
  (16, 'bewaartermijn', 'Hoe lang bewaart u de persoonsgegevens?', 'text', 'Bijv. tot 1 jaar na beeindiging opdracht', NULL, true, NULL),
  (17, 'locatie_verwerking', 'Waar vindt de verwerking plaats?', 'select', NULL, ARRAY['Europese Economische Ruimte', 'Binnen en buiten de EER', 'Wereldwijd'], false, NULL),
  (18, 'doorgifte_buiten_eer', 'Worden gegevens doorgegeven buiten de EER?', 'radio', NULL, ARRAY['Ja', 'Nee'], false, 'Bijv. bij gebruik van Amerikaanse diensten zoals Google of Mailchimp.')
) AS q(sort_order, question_key, question_text, question_type, placeholder, options, is_required, help_text)
WHERE d.slug = 'verwerkersovereenkomst'
ON CONFLICT (document_id, question_key) DO UPDATE SET
  sort_order = EXCLUDED.sort_order,
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  placeholder = EXCLUDED.placeholder,
  options = EXCLUDED.options,
  is_required = EXCLUDED.is_required,
  help_text = EXCLUDED.help_text;

-- ============================================================
-- 3. Algemene Voorwaarden
-- ============================================================

INSERT INTO document_questions (document_id, sort_order, question_key, question_text, question_type, placeholder, options, is_required, help_text)
SELECT d.id, q.sort_order, q.question_key, q.question_text, q.question_type, q.placeholder, q.options, q.is_required, q.help_text
FROM documents d
CROSS JOIN (VALUES
  (1,  'bedrijfsnaam', 'Wat is uw bedrijfsnaam?', 'text', 'Bijv. VA Studio', NULL::text[], true, NULL),
  (2,  'kvk_nummer', 'Wat is uw KvK-nummer?', 'text', 'Bijv. 12345678', NULL, true, NULL),
  (3,  'btw_nummer', 'Wat is uw BTW-nummer?', 'text', 'Bijv. NL001234567B01', NULL, true, NULL),
  (4,  'vestigingsadres', 'Wat is uw vestigingsadres?', 'text', 'Straat, huisnummer, postcode, plaats', NULL, true, NULL),
  (5,  'contactgegevens', 'Wat is uw zakelijke e-mailadres?', 'text', 'info@uwbedrijf.nl', NULL, true, 'Dit e-mailadres wordt vermeld in de algemene voorwaarden.'),
  (6,  'telefoon', 'Wat is uw zakelijke telefoonnummer?', 'text', 'Bijv. 06-12345678', NULL, false, 'Optioneel. Wordt vermeld als contactmogelijkheid.'),
  (7,  'diensten_omschrijving', 'Beschrijf uw dienstverlening', 'textarea', 'Bijv. virtuele assistentie, social media management, klantenservice...', NULL, true, 'Een korte omschrijving van de diensten die u aanbiedt.'),
  (8,  'tarieven_betalingstermijn', 'Beschrijf uw tarieven en facturatie', 'textarea', 'Bijv. uurtarief EUR 55 excl. BTW, facturatie per maand...', NULL, true, 'Hoe worden uw diensten berekend en gefactureerd?'),
  (9,  'betaaltermijn', 'Wat is uw standaard betalingstermijn?', 'select', NULL, ARRAY['14 dagen', '30 dagen', '60 dagen'], false, NULL),
  (10, 'aansprakelijkheid', 'Hoe wilt u aansprakelijkheid beperken?', 'textarea', 'Bijv. beperkt tot het factuurbedrag van de betreffende opdracht...', NULL, true, 'Beschrijf de grenzen van uw aansprakelijkheid.'),
  (11, 'intellectueel_eigendom', 'Hoe regelt u intellectueel eigendom?', 'textarea', 'Bijv. IE-rechten gaan over na volledige betaling...', NULL, true, 'Wie is eigenaar van het opgeleverde werk?'),
  (12, 'geheimhouding', 'Wilt u een geheimhoudingsclausule opnemen?', 'radio', NULL, ARRAY['Ja', 'Nee'], true, 'Verplicht beide partijen tot geheimhouding van vertrouwelijke informatie.'),
  (13, 'opzegtermijn', 'Wat is de opzegtermijn?', 'select', NULL, ARRAY['14 dagen', '1 maand', '2 maanden', '3 maanden'], true, NULL),
  (14, 'klachtenprocedure', 'Hoe kunnen klanten een klacht indienen?', 'textarea', 'Bijv. schriftelijk per e-mail, reactie binnen 14 werkdagen...', NULL, true, 'Beschrijf het proces voor het afhandelen van klachten.'),
  (15, 'geschillenbeslechting', 'Hoe worden geschillen beslecht?', 'select', NULL, ARRAY['Nederlandse rechter', 'Mediator', 'Arbitrage'], false, NULL),
  (16, 'formeel_informeel', 'Welke schrijfstijl heeft uw voorkeur?', 'radio', NULL, ARRAY['Informeel', 'Formeel'], false, 'Informeel = je/jouw, Formeel = u/uw')
) AS q(sort_order, question_key, question_text, question_type, placeholder, options, is_required, help_text)
WHERE d.slug = 'algemene-voorwaarden'
ON CONFLICT (document_id, question_key) DO UPDATE SET
  sort_order = EXCLUDED.sort_order,
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  placeholder = EXCLUDED.placeholder,
  options = EXCLUDED.options,
  is_required = EXCLUDED.is_required,
  help_text = EXCLUDED.help_text;

-- ============================================================
-- 4. Privacyverklaring AVG
-- ============================================================

INSERT INTO document_questions (document_id, sort_order, question_key, question_text, question_type, placeholder, options, is_required, help_text)
SELECT d.id, q.sort_order, q.question_key, q.question_text, q.question_type, q.placeholder, q.options, q.is_required, q.help_text
FROM documents d
CROSS JOIN (VALUES
  -- Bedrijfsgegevens
  (1,  'bedrijfsnaam', 'Wat is uw bedrijfsnaam?', 'text', 'Bijv. VA Studio', NULL::text[], true, NULL),
  (2,  'straatnaam', 'Wat is uw straatnaam?', 'text', 'Bijv. Keizersgracht', NULL, false, 'Vestigingsadres van uw bedrijf.'),
  (3,  'huisnummer', 'Wat is uw huisnummer?', 'text', 'Bijv. 123', NULL, false, NULL),
  (4,  'postcode', 'Wat is uw postcode?', 'text', 'Bijv. 1015AA', NULL, false, NULL),
  (5,  'plaatsnaam', 'Wat is uw plaatsnaam?', 'text', 'Bijv. Amsterdam', NULL, false, NULL),
  (6,  'ander_contactadres', 'Heeft u een ander contactadres dan het vestigingsadres?', 'radio', NULL, ARRAY['Ja', 'Nee'], false, NULL),
  (7,  'contact_straatnaam', 'Contactadres straatnaam', 'text', NULL, NULL, false, 'Alleen invullen bij een ander contactadres.'),
  (8,  'contact_huisnummer', 'Contactadres huisnummer', 'text', NULL, NULL, false, NULL),
  (9,  'contact_postcode', 'Contactadres postcode', 'text', NULL, NULL, false, NULL),
  (10, 'contact_plaatsnaam', 'Contactadres plaatsnaam', 'text', NULL, NULL, false, NULL),
  (11, 'contactadres_vermelden', 'Wilt u het contactadres vermelden in de privacyverklaring?', 'radio', NULL, ARRAY['Ja', 'Nee'], false, NULL),
  (12, 'rechtsvorm', 'Wat is uw rechtsvorm?', 'select', NULL, ARRAY['Eenmanszaak', 'Vof', 'Anders (bijv. BV of stichting)'], true, NULL),
  (13, 'kvk_inschrijving', 'Staat u ingeschreven bij de KvK?', 'radio', NULL, ARRAY['Ja', 'Nee'], false, NULL),
  (14, 'kvk_nummer', 'Wat is uw KvK-nummer?', 'text', 'Bijv. 12345678', NULL, true, NULL),
  -- Persoonsgegevens
  (15, 'voornaam', 'Wat is uw voornaam?', 'text', NULL, NULL, true, NULL),
  (16, 'achternaam', 'Wat is uw achternaam?', 'text', NULL, NULL, true, NULL),
  (17, 'geslacht', 'Welke voornaamwoorden wilt u gebruiken in het document?', 'select', NULL, ARRAY['Vrouwelijk (zij; haar)', 'Mannelijk (hij; hem; zijn)', 'Neutraal (hij/zij; hem/haar; zijn/haar)'], false, NULL),
  (18, 'formeel_informeel', 'Welke schrijfstijl heeft uw voorkeur?', 'radio', NULL, ARRAY['Informeel', 'Formeel'], false, 'Informeel = je/jouw, Formeel = u/uw'),
  -- Contact
  (19, 'website', 'Heeft u een website?', 'select', NULL, ARRAY['Ja', 'Nog niet, maar ik heb WEL al een URL', 'Nog niet, ik heb nog GEEN URL', 'Nee'], true, NULL),
  (20, 'website_url', 'Wat is de URL van uw website?', 'text', 'https://www.uwwebsite.nl', NULL, false, NULL),
  (21, 'contact_mogelijkheden', 'Op welke manieren kunnen klanten contact met u opnemen?', 'checkbox', NULL, ARRAY['Telefonisch bellen', 'WhatsApp', 'Contactformulier website', 'Socialemediakanalen', 'Anders'], true, 'Selecteer alle manieren waarop u bereikbaar bent.'),
  (22, 'email_privacyverklaring', 'Wat is uw e-mailadres voor de privacyverklaring?', 'text', 'info@uwbedrijf.nl', NULL, true, 'Dit adres wordt vermeld als contactpunt voor privacy-gerelateerde vragen.'),
  (23, 'adres_in_verklaring', 'Wilt u uw adres vermelden in de privacyverklaring?', 'radio', NULL, ARRAY['Ja', 'Nee'], false, NULL),
  (24, 'telefoon_in_verklaring', 'Wilt u uw telefoonnummer vermelden?', 'select', NULL, ARRAY['Ja', 'Nee', 'N.v.t.'], false, NULL),
  (25, 'telefoonnummer', 'Wat is uw telefoonnummer?', 'text', 'Bijv. 06-12345678', NULL, false, NULL),
  -- Verwerkingsdoelen
  (26, 'verwerkingsdoelen', 'Waarvoor verwerkt u persoonsgegevens?', 'checkbox', NULL, ARRAY['Om te reageren op contact- of informatieverzoeken', 'Om offertes op te stellen en te versturen', 'Om (kennismakings)gesprekken in te plannen en te bevestigen', 'Om contacten te informeren over wijzigingen in je dienstverlening', 'Om nieuwsbrieven te versturen', 'Om relatiegeschenken, attenties en kaarten te versturen', 'Om reviews op je website of socialemediakanalen te plaatsen', 'Om evaluatieformulieren toe te sturen', 'Anders'], true, 'Selecteer alle doelen waarvoor u persoonsgegevens verwerkt.'),
  (27, 'online_identificatoren', 'Welke online activiteiten voert u uit?', 'checkbox', NULL, ARRAY['iDEAL betalingen ontvangen via website', 'Gratis digitale weggevers overhandigen', 'Websitebezoeken monitoren', 'Andere online identificatoren', 'Nee, niet van toepassing'], false, NULL),
  -- Persoonsgegevens verwerkt
  (28, 'persoonsgegevens_verwerkt', 'Welke persoonsgegevens verwerkt u?', 'checkbox', NULL, ARRAY['Bedrijfsnaam', 'KvK nummer', 'Rechtsvorm', 'Voor- en achternaam', 'Gender', 'Woonadres en/of vestigingsadres', 'Telefoonnummer', 'Websiteadres', 'E-mailadres', 'Functie', 'Betaalgegevens zoals bankrekeningnummer', 'Btw-ID nummer', 'Klantnummer, offertenummer en factuurnummer'], true, 'Selecteer alle soorten persoonsgegevens die u verwerkt.'),
  (29, 'geboortedatum', 'Verwerkt u geboortedata?', 'radio', NULL, ARRAY['Ja', 'Nee'], false, NULL),
  (30, 'fotos', 'Verwerkt u foto''s van betrokkenen?', 'radio', NULL, ARRAY['Ja', 'Nee'], false, NULL),
  (31, 'overige_gegevens', 'Verwerkt u nog andere gegevens?', 'checkbox', NULL, ARRAY['Filmmateriaal', 'Financiele gegevens', 'Geboorteplaats', 'BSN', 'Anders', 'Nee, ik verwerk deze persoonsgegevens niet'], false, NULL),
  (32, 'bijzondere_persoonsgegevens', 'Verwerkt u bijzondere persoonsgegevens?', 'radio', NULL, ARRAY['Ja', 'Nee'], false, 'Bijzondere persoonsgegevens zijn o.a. medische gegevens, ras, religie, politieke voorkeur.'),
  (33, 'bijzondere_welke', 'Welke bijzondere persoonsgegevens verwerkt u?', 'checkbox', NULL, ARRAY['Medische gegevens', 'Ras of etnische afkomst', 'Seksuele voorkeur', 'Religieuze of levensbeschouwelijke overtuiging', 'Politieke voorkeur', 'Biometrische persoonsgegevens', 'Genetische persoonsgegevens', 'Lidmaatschap vakvereniging', 'Anders'], false, 'Alleen invullen als u bijzondere persoonsgegevens verwerkt.'),
  -- Derde partijen
  (34, 'derde_partijen', 'Met welke derde partijen deelt u persoonsgegevens?', 'checkbox', NULL, ARRAY['Nieuwsbrieven versturen (bijv. Mailblue)', 'Boekhouding doen (bijv. boekhouder en MoneyBird)', 'Betalingen en incassos afhandelen (bijv. MoneyBird)', 'Gewerkte uren registreren (bijv. Toggl)', 'Digitaal handtekeningen verzorgen (bijv. DocuSign)', 'Website hosten en e-mails versturen (bijv. Vimexx)', 'Webanalyses doen', 'Online meetings organiseren (bijv. Google Meet/Teams)', 'Online agenda verzorgen (bijv. Calendly)', 'Documenten opslaan in de cloud (bijv. Google Drive)', 'Prettig online samenwerken (bijv. Trello)', 'Klanten beheren in een CRM-systeem', 'Efficient communiceren (bijv. WhatsApp/Slack)', 'Anders', 'N.v.t.: ik werk niet samen met derde partijen'], true, NULL),
  (35, 'buiten_eer', 'Worden persoonsgegevens verwerkt buiten de EER?', 'radio', NULL, ARRAY['Ja', 'Nee'], false, 'Bijv. bij gebruik van Amerikaanse diensten.'),
  -- Beveiliging
  (36, 'technische_maatregelen', 'Welke technische beveiligingsmaatregelen treft u?', 'checkbox', NULL, ARRAY['SSL-certificaat voor je website', 'Computer, programma''s en accounts beveiligen met veilige wachtwoorden', 'Beveiliging met tweestapsverificatie waar mogelijk', 'Het gebruiken van een beveiligde cloudopslag', 'Het gebruik van een beveiligd CRM-systeem', 'Het gebruiken van anti-virus software en firewall', 'Software up-to-date houden', 'Het regelmatig maken van back-ups', 'Pseudonimiseren en versleutelen (encryptie)', 'Anders'], true, NULL),
  (37, 'organisatorische_maatregelen', 'Welke organisatorische beveiligingsmaatregelen treft u?', 'checkbox', NULL, ARRAY['Maatregelen van tijd tot tijd testen, beoordelen en evalueren', 'Als beleid nooit inloggen op een onbeveiligd netwerk', 'Verouderde gegevens automatisch verwijderen', 'Regelmatig beoordelen of dezelfde doelen behaald kunnen worden met minder persoonsgegevens', 'Als zich er toch een incident voordoet, kan het tijdig hersteld worden', 'Anders'], true, NULL),
  -- Cookies
  (38, 'cookies_gebruik', 'Maakt uw website gebruik van cookies?', 'radio', NULL, ARRAY['Ja', 'Nee'], false, NULL),
  (39, 'cookie_types', 'Welke soorten cookies gebruikt u?', 'checkbox', NULL, ARRAY['Functionele cookies', 'Analytische cookies', 'Trackingcookies'], false, NULL),
  (40, 'cookie_subcategorieen', 'Welke cookie-subcategorieen zijn van toepassing?', 'checkbox', NULL, ARRAY['Social media buttons', 'Optimalisatiecookies', 'Google (analytics of ads) cookies', 'N.v.t.'], false, NULL)
) AS q(sort_order, question_key, question_text, question_type, placeholder, options, is_required, help_text)
WHERE d.slug = 'privacyverklaring-avg'
ON CONFLICT (document_id, question_key) DO UPDATE SET
  sort_order = EXCLUDED.sort_order,
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  placeholder = EXCLUDED.placeholder,
  options = EXCLUDED.options,
  is_required = EXCLUDED.is_required,
  help_text = EXCLUDED.help_text;

-- ============================================================
-- 5. Cookieverklaring
-- ============================================================
-- Uses the privacyverklaring interview (privacydocsp05) with passthrough transform.
-- Questions use DA variable names directly since there is no dedicated transform.

INSERT INTO document_questions (document_id, sort_order, question_key, question_text, question_type, placeholder, options, is_required, help_text)
SELECT d.id, q.sort_order, q.question_key, q.question_text, q.question_type, q.placeholder, q.options, q.is_required, q.help_text
FROM documents d
CROSS JOIN (VALUES
  (1, 'bedrijfsnaam_client', 'Wat is uw bedrijfsnaam?', 'text', 'Bijv. VA Studio', NULL::text[], true, NULL),
  (2, 'url_client', 'Wat is de URL van uw website?', 'text', 'https://www.uwwebsite.nl', NULL, true, 'De website waarvoor de cookieverklaring geldt.'),
  (3, 'cookiesgebruik_pvv', 'Maakt uw website gebruik van cookies?', 'radio', NULL, ARRAY['Ja', 'Nee'], true, NULL),
  (4, 'cookie_types', 'Welke soorten cookies gebruikt u?', 'checkbox', NULL, ARRAY['Functionele cookies', 'Analytische cookies', 'Trackingcookies'], true, 'Selecteer alle soorten cookies die uw website plaatst.'),
  (5, 'cookie_subcategorieen', 'Welke cookie-subcategorieen zijn van toepassing?', 'checkbox', NULL, ARRAY['Social media buttons', 'Optimalisatiecookies', 'Google (analytics of ads) cookies', 'N.v.t.'], false, NULL),
  (6, 'formeel_doc', 'Welke schrijfstijl heeft uw voorkeur?', 'radio', NULL, ARRAY['Informeel', 'Formeel'], false, 'Informeel = je/jouw, Formeel = u/uw')
) AS q(sort_order, question_key, question_text, question_type, placeholder, options, is_required, help_text)
WHERE d.slug = 'cookieverklaring'
ON CONFLICT (document_id, question_key) DO UPDATE SET
  sort_order = EXCLUDED.sort_order,
  question_text = EXCLUDED.question_text,
  question_type = EXCLUDED.question_type,
  placeholder = EXCLUDED.placeholder,
  options = EXCLUDED.options,
  is_required = EXCLUDED.is_required,
  help_text = EXCLUDED.help_text;

-- ============================================================
-- Verification query
-- ============================================================
-- Run after insert to verify all documents have questions:
-- SELECT d.slug, COUNT(dq.id) as question_count
-- FROM documents d
-- LEFT JOIN document_questions dq ON dq.document_id = d.id
-- WHERE d.is_active = true
-- GROUP BY d.slug
-- ORDER BY d.sort_order;
