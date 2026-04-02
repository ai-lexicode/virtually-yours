/**
 * Transform Virtually Yours questionnaire answers into DocAssemble variable format.
 *
 * DocAssemble interviews expect specific variable names and types:
 * - Simple strings: bedrijfsnaam_client, url_client, etc.
 * - Booleans: True/False for yes/no
 * - Python dicts with boolean values for checkbox groups:
 *   e.g. contact_client = { 'telefoon': True, 'whatsapp': False }
 *
 * This module maps our question_keys to the DA variable names and converts
 * checkbox JSON arrays into the dict format DA expects.
 */

type DaVariables = Record<string, unknown>;

/**
 * Parse a JSON array string into a string[], or return empty array.
 */
function parseCheckbox(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Convert checkbox selections into a DA dict with boolean values.
 * Maps each UI label to a DA dict key.
 */
function checkboxToDict(
  value: string,
  labelToKey: Record<string, string>
): Record<string, boolean> {
  const selected = parseCheckbox(value);
  const dict: Record<string, boolean> = {};
  for (const [label, key] of Object.entries(labelToKey)) {
    dict[key] = selected.includes(label);
  }
  return dict;
}

/**
 * Map a yes/no radio answer to a DA-compatible value.
 */
function yesNo(value: string): string {
  const v = value.toLowerCase().trim();
  if (v === "ja") return "ja";
  if (v === "nee") return "nee";
  return value;
}

// ============================================================
// Privacyverklaring AVG transformation
// ============================================================

function transformPrivacyverklaring(
  raw: Record<string, string>
): DaVariables {
  const vars: DaVariables = {};

  // --- Bedrijfsgegevens ---
  vars.bedrijfsnaam_client = raw.bedrijfsnaam ?? "";
  vars.straatnaam_client = raw.straatnaam ?? "";
  vars.huisnummer_client = raw.huisnummer ?? "";
  vars.postcode_client = raw.postcode ?? "";
  vars.plaatsnaam_client = raw.plaatsnaam ?? "";

  vars.andercontactadres_client = yesNo(raw.ander_contactadres ?? "nee");
  vars.contactstraatnaam_client = raw.contact_straatnaam ?? "";
  vars.contacthuisnummer_client = raw.contact_huisnummer ?? "";
  vars.contactpostcode_client = raw.contact_postcode ?? "";
  vars.contactplaatsnaam_client = raw.contact_plaatsnaam ?? "";
  vars.contactadresvermelden_client = yesNo(
    raw.contactadres_vermelden ?? "nee"
  );

  // Rechtsvorm: map UI labels to DA values
  const rechtsvormMap: Record<string, string> = {
    Eenmanszaak: "eenmanszaak",
    Vof: "vof",
    "Anders (bijv. BV of stichting)": "anders",
  };
  vars.rechtsvorm_client =
    rechtsvormMap[raw.rechtsvorm ?? ""] ?? raw.rechtsvorm ?? "";

  vars.kvkinschrijving_client = yesNo(raw.kvk_inschrijving ?? "ja");
  vars.kvknummer_client = raw.kvk_nummer ?? "";

  // --- Persoonsgegevens ---
  vars.voornaam_client = raw.voornaam ?? "";
  vars.achternaam_client = raw.achternaam ?? "";

  // Gender: map to DA values
  const geslachtMap: Record<string, string> = {
    "Vrouwelijk (zij; haar)": "Vrouwelijk",
    "Mannelijk (hij; hem; zijn)": "Mannelijk",
    "Neutraal (hij/zij; hem/haar; zijn/haar)": "Neutraal",
  };
  vars.geslacht_client =
    geslachtMap[raw.geslacht ?? ""] ?? raw.geslacht ?? "";

  // Formeel/Informeel
  vars.formeel_doc = raw.formeel_informeel ?? "Informeel";

  // --- Contactmogelijkheden ---
  const websiteMap: Record<string, string> = {
    Ja: "ja",
    "Nog niet, maar ik heb WEL al een URL": "alvast",
    "Nog niet, ik heb nog GEEN URL": "nog geen URL",
    Nee: "nee",
  };
  vars.website_client = websiteMap[raw.website ?? ""] ?? raw.website ?? "";
  vars.url_client = raw.website_url ?? "";

  // Contact mogelijkheden → DA dict
  vars.contact_client = checkboxToDict(raw.contact_mogelijkheden ?? "[]", {
    "Telefonisch bellen": "telefoon",
    WhatsApp: "whatsapp",
    "Contactformulier website": "contactformulier",
    Socialemediakanalen: "socials",
    Anders: "anders",
  });
  // Template also accesses contact_client['email']
  (vars.contact_client as Record<string, boolean>).email =
    (raw.email_privacyverklaring ?? "").length > 0;

  vars.email_client = raw.email_privacyverklaring ?? "";
  vars.adres_pvv = yesNo(raw.adres_in_verklaring ?? "nee");

  // Telefoon in verklaring
  const telMap: Record<string, string> = {
    Nee: "nee",
    Ja: "ja",
    "N.v.t.": "nvt",
  };
  vars.telefoon_pvv = telMap[raw.telefoon_in_verklaring ?? ""] ?? "nee";
  vars.telefoonnummer_client = raw.telefoonnummer ?? "";

  // --- Verwerking Persoonsgegevens ---
  vars.verwerkingsdoelen_pvv = checkboxToDict(
    raw.verwerkingsdoelen ?? "[]",
    {
      "Om te reageren op contact- of informatieverzoeken": "contactverzoek",
      "Om offertes op te stellen en te versturen": "offertes",
      "Om (kennismakings)gesprekken in te plannen en te bevestigen":
        "kennismakingsgesprek",
      "Om contacten te informeren over wijzigingen in je dienstverlening":
        "wijzigingen",
      "Om nieuwsbrieven te versturen": "nieuwsbrieven",
      "Om relatiegeschenken, attenties en kaarten te versturen":
        "relatiegeschenken",
      "Om reviews op je website of socialemediakanalen te plaatsen": "reviews",
      "Om evaluatieformulieren toe te sturen": "evaluatieformulieren",
      Anders: "anders",
    }
  );

  vars.webtraffic_pvv = checkboxToDict(raw.online_identificatoren ?? "[]", {
    "iDEAL betalingen ontvangen via website": "ideal",
    "Gratis digitale weggevers overhandigen": "weggevers",
    "Websitebezoeken monitoren": "websitebezoeken",
    "Andere online identificatoren": "anders",
    "Nee, niet van toepassing": "nee",
  });

  // Veelgebruikte persoonsgegevens → inverted logic in DA: True = verwerkt
  vars.persoonsgegevensniet_client = checkboxToDict(
    raw.persoonsgegevens_verwerkt ?? "[]",
    {
      Bedrijfsnaam: "bedrijfsnaam",
      "KvK nummer": "kvk",
      Rechtsvorm: "rechtsvorm",
      "Voor- en achternaam": "naam",
      Gender: "gender",
      "Woonadres en/of vestigingsadres": "adres",
      Telefoonnummer: "telefoon",
      Websiteadres: "website",
      "E-mailadres": "email",
      Functie: "functie",
      "Betaalgegevens zoals bankrekeningnummer": "betaalgegevens",
      "Btw-ID nummer": "btw",
      "Klantnummer, offertenummer en factuurnummer": "klantnummer",
    }
  );

  vars.geboortedatum_pvv = yesNo(raw.geboortedatum ?? "nee");
  vars.fotos_pvv = yesNo(raw.fotos ?? "nee");

  vars.overigegegevens_pvv = checkboxToDict(raw.overige_gegevens ?? "[]", {
    Filmmateriaal: "filmmateriaal",
    "Financiele gegevens": "financiële gegevens",
    Geboorteplaats: "geboorteplaats",
    BSN: "bsn",
    Anders: "anders",
    "Nee, ik verwerk deze persoonsgegevens niet": "nee",
  });

  vars.bijzonderepersgegverwerkt_pvv = yesNo(
    raw.bijzondere_persoonsgegevens ?? "nee"
  );

  vars.bijzonderepersgeg_pvv = checkboxToDict(
    raw.bijzondere_welke ?? "[]",
    {
      "Medische gegevens": "medisch",
      "Ras of etnische afkomst": "afkomst",
      "Seksuele voorkeur": "seksueel",
      "Religieuze of levensbeschouwelijke overtuiging": "religie",
      "Politieke voorkeur": "politiek",
      "Biometrische persoonsgegevens": "biometrisch",
      "Genetische persoonsgegevens": "genetisch",
      "Lidmaatschap vakvereniging": "vakvereniging",
      Anders: "anders",
    }
  );

  vars.derdepartijenspec_pvv = checkboxToDict(
    raw.derde_partijen ?? "[]",
    {
      "Nieuwsbrieven versturen (bijv. Mailblue)": "nieuwsbrief",
      "Boekhouding doen (bijv. boekhouder en MoneyBird)": "boekhouding",
      "Betalingen en incassos afhandelen (bijv. MoneyBird)": "betalingen",
      "Gewerkte uren registreren (bijv. Toggl)": "urenregistratie",
      "Digitaal handtekeningen verzorgen (bijv. DocuSign)":
        "digitale handtekening",
      "Website hosten en e-mails versturen (bijv. Vimexx)": "webhosting",
      "Webanalyses doen": "webanalyse",
      "Online meetings organiseren (bijv. Google Meet/Teams)":
        "online meetings",
      "Online agenda verzorgen (bijv. Calendly)": "online agenda",
      "Documenten opslaan in de cloud (bijv. Google Drive)": "cloudopslag",
      "Prettig online samenwerken (bijv. Trello)": "online samenwerking",
      "Klanten beheren in een CRM-systeem": "crm",
      "Efficient communiceren (bijv. WhatsApp/Slack)": "communicatie",
      Anders: "anders",
      "N.v.t.: ik werk niet samen met derde partijen": "nee",
    }
  );

  vars.buiteneer_pvv = yesNo(raw.buiten_eer ?? "nee");

  // --- Databeveiliging ---
  vars.techmaatregelen_pvv = checkboxToDict(
    raw.technische_maatregelen ?? "[]",
    {
      "SSL-certificaat voor je website": "ssl",
      "Computer, programma's en accounts beveiligen met veilige wachtwoorden":
        "wachtwoorden",
      "Beveiliging met tweestapsverificatie waar mogelijk": "2staps",
      "Het gebruiken van een beveiligde cloudopslag": "cloudopslag",
      "Het gebruik van een beveiligd CRM-systeem": "crm",
      "Het gebruiken van anti-virus software en firewall": "anti-virus",
      "Software up-to-date houden": "up-to-date",
      "Het regelmatig maken van back-ups": "back-ups",
      "Pseudonimiseren en versleutelen (encryptie)": "encryptie",
      Anders: "anders",
    }
  );

  vars.orgmaatregelen_pvv = checkboxToDict(
    raw.organisatorische_maatregelen ?? "[]",
    {
      "Maatregelen van tijd tot tijd testen, beoordelen en evalueren":
        "maatregelen testen",
      "Als beleid nooit inloggen op een onbeveiligd netwerk":
        "onbeveiligd netwerk",
      "Verouderde gegevens automatisch verwijderen": "verouderde gegevens",
      "Regelmatig beoordelen of dezelfde doelen behaald kunnen worden met minder persoonsgegevens":
        "minder gegevens",
      "Als zich er toch een incident voordoet, kan het tijdig hersteld worden":
        "tijdig herstel",
      Anders: "anders",
    }
  );

  // --- Cookies ---
  vars.cookiesgebruik_pvv = yesNo(raw.cookies_gebruik ?? "nee");

  vars.cookies_pvv = checkboxToDict(raw.cookie_types ?? "[]", {
    "Functionele cookies": "functioneel",
    "Analytische cookies": "analytisch",
    Trackingcookies: "tracking",
  });

  vars.cookiessub_pvv = checkboxToDict(raw.cookie_subcategorieen ?? "[]", {
    "Social media buttons": "social",
    Optimalisatiecookies: "optimalisatie",
    "Google (analytics of ads) cookies": "google",
    "N.v.t.": "nee",
  });

  // --- Pronouns (derived from formeel_doc) ---
  const informal = vars.formeel_doc === "Informeel";
  vars.persvnwonderwerpinf_lezer = informal ? "je" : "u";
  vars.persvnwonderwerpinfcap_lezer = informal ? "Je" : "U";
  vars.persvnwvoorwerpinf_lezer = informal ? "jou" : "u";
  vars.bezitvnwinf_lezer = informal ? "jouw" : "uw";
  vars.bezitvnwinfcap_lezer = informal ? "Jouw" : "Uw";

  return vars;
}

// ============================================================
// Overeenkomst van Opdracht transformation
// ============================================================

function transformOvereenkomstVanOpdracht(
  raw: Record<string, string>
): DaVariables {
  const vars: DaVariables = {};

  // The questionnaire captures simplified fields; the DA template
  // expects the freelancer (opdrachtnemer) as "client" and the
  // opdrachtgever details are placeholders in the template.

  // --- Opdrachtnemer → DA "client" variables ---
  vars.bedrijfsnaam_client = raw.opdrachtnemer_naam ?? "";
  vars.kvkinschrijving_client = "ja";
  vars.kvknummer_client = raw.opdrachtnemer_kvk ?? "";

  // Split opdrachtnemer name into first/last (best effort)
  const nameParts = (raw.opdrachtnemer_naam ?? "").trim().split(/\s+/);
  vars.voornaam_client = nameParts[0] ?? "";
  vars.achternaam_client = nameParts.slice(1).join(" ") || (nameParts[0] ?? "");

  // Address defaults (not collected in simplified questionnaire)
  vars.straatnaam_client = "";
  vars.huisnummer_client = "";
  vars.postcode_client = "";
  vars.plaatsnaam_client = "";
  vars.andercontactadres_client = "nee";
  vars.contactstraatnaam_client = "n.v.t.";
  vars.contacthuisnummer_client = "n.v.t.";
  vars.contactpostcode_client = "n.v.t.";
  vars.contactplaatsnaam_client = "n.v.t.";
  vars.contactadresvermelden_client = "nee";
  vars.rechtsvorm_client = "eenmanszaak";
  vars.website_client = "nee";
  vars.url_client = "n.v.t.";
  vars.verzekering_client = "ja";

  // Pronouns (default neutral)
  vars.bezitvnw_client = "zijn/haar";
  vars.persvnwonderwerp_client = "hij/zij";
  vars.persvnwonderwerpcap_client = "Hij/Zij";
  vars.persvnwvoorwerp_client = "hem/haar";

  // --- Work ---
  vars.werkcat_client = "ondersteunende werkzaamheden";
  vars.werkzaamhedenA_client = raw.werkzaamheden ?? "";
  vars.werkzaamhedenB_client = "";
  vars.werkzaamhedenC_client = "";
  vars.werkzaamhedenD_client = "";
  vars.werkzaamhedenE_client = "";

  // Bereikbaarheid / locatie
  vars.bereikbaarheidtijd_client = "nee";
  vars.bereikbaarovo_client = "nee";
  vars.beschikbaarovo_client = "nee";
  vars.locatiewerken_client = "op afstand";

  // --- Contract terms ---
  const hasEndDate = !!raw.einddatum;
  vars.looptijd_ovk = hasEndDate ? "bepaalde tijd" : "onbepaalde tijd";
  vars.looptijdgetal_ovk = hasEndDate ? "anders" : "n.v.t.";
  vars.verlenging_ovk = "nee";
  vars.verlengingsperiode_ovk = "n.v.t.";
  vars.proeftijd_ovk = "nee";
  vars.tussentijdsopzeggen_ovk = "ja";
  vars.opzegtermijn_ovk = "1 maand";

  // --- Billing: nacalculatie (hourly) ---
  vars.facturatiewijze_ovk = {
    nacalculatie: true,
    abonnement: false,
    flatfee: false,
    projectprijs: false,
    strippenkaart: false,
  };
  vars.exclbtw_ovk = raw.tarief ?? "";

  // Payment term: extract number from "14 dagen" / "30 dagen" / "60 dagen"
  const termijnMatch = (raw.betaling_termijn ?? "30").match(/\d+/);
  vars.betaaltermijn_ovk = termijnMatch ? `${termijnMatch[0]} dagen` : "30 dagen";

  vars.afrondingnacalculatie_ovk = "nee";
  vars.afrondingbovenbeneden_ovk = "n.v.t.";
  vars.nacalurenwerkzaamheden_ovk = "ja";
  vars.urendeclaratie_ovk = "nee";
  vars.urenregistratie_ovk = "ja";
  vars.urenregwijze_ovk = "per e-mail";
  vars.inzageuren_ovk = "desgewenst";
  vars.inzageurenwijze_ovk = "per e-mail";
  vars.minafnamewerkzaamheden_ovk = "nee";
  vars.minafnameuren_ovk = "n.v.t.";
  vars.maxafnameuren_ovk = "n.v.t.";
  vars.minaantaluren_ovk = "n.v.t.";
  vars.maximumaantal_ovk = "n.v.t.";
  vars.mingebruikuren_ovk = "n.v.t.";
  vars.mingebruikaantaluren_ovk = "n.v.t.";
  vars.ongebruikteuren_ovk = "n.v.t.";
  vars.meeruren_ovk = "n.v.t.";
  vars.spoedtarief_ovk = "nee";
  vars.staffelkorting_ovk = "nee";
  vars.instaptarief_ovk = "n.v.t.";

  // Flatfee / abonnement / strippenkaart / project (all unused)
  vars.flatfeenacal_ovk = "nee";
  vars.flatfeenacalwijze_ovk = {
    "per uur": false,
    "per geleverde dienst": false,
    "per verkoop": false,
    anders: false,
  };
  vars.uurbasispakket_ovk = "n.v.t.";
  vars.abofacturatieperiode_ovk = "n.v.t.";
  vars.voorafachterafabo_ovk = "n.v.t.";
  vars.urencreditatie_ovk = "n.v.t.";
  vars.geldigstrippenkaart_ovk = "n.v.t.";
  vars.uurbasisvasteprijs_ovk = "n.v.t.";
  vars.minafnameproject_ovk = "n.v.t.";
  vars.meerwerkproject_ovk = "n.v.t.";
  vars.voorafachterafproject_ovk = "n.v.t.";

  // --- Agreement ---
  vars.akkoord_ovk = {
    "e-mail": true,
    digitaal: false,
    schriftelijk: false,
    anders: false,
  };
  vars.avwgebruik_ovk = "nee";
  vars.avwbuitentoepassing_ovk = "n.v.t.";
  vars.aanpassingsrecht_ovk = "nee";
  vars.handtekening_ovo = "ja";
  vars.paraaf_ovo = "nee";

  // --- Travel ---
  vars.reiskostenovo_ovk = "nee";
  vars.reiskosten_client = "n.v.t.";
  vars.reistijdkosten_client = "n.v.t.";
  vars.parkeerkosten_client = "n.v.t.";

  return vars;
}

// ============================================================
// Verwerkersovereenkomst transformation
// ============================================================

function transformVerwerkersovereenkomst(
  raw: Record<string, string>
): DaVariables {
  const vars: DaVariables = {};

  // --- Verwerker (VA/online professional) ---
  vars.verwerker_bedrijfsnaam = raw.verwerker_bedrijfsnaam ?? "";
  vars.verwerker_kvk = raw.verwerker_kvk ?? "";
  vars.verwerker_adres = raw.verwerker_adres ?? "";
  vars.verwerker_contactpersoon = raw.verwerker_contactpersoon ?? "";
  vars.verwerker_email = raw.verwerker_email ?? "";

  // --- Verwerkingsverantwoordelijke (client/opdrachtgever) ---
  vars.verantwoordelijke_bedrijfsnaam =
    raw.verwerkingsverantwoordelijke_bedrijfsnaam ?? "";
  vars.verantwoordelijke_kvk =
    raw.verwerkingsverantwoordelijke_kvk ?? "";
  vars.verantwoordelijke_adres =
    raw.verwerkingsverantwoordelijke_adres ?? "";
  vars.verantwoordelijke_contactpersoon =
    raw.verwerkingsverantwoordelijke_contactpersoon ?? "";
  vars.verantwoordelijke_email =
    raw.verwerkingsverantwoordelijke_email ?? "";

  // --- Verwerking details ---
  vars.verwerkingsdoel = raw.verwerkingsdoel ?? "";
  vars.categorieen_betrokkenen = raw.categorieen_betrokkenen ?? "";
  vars.categorieen_persoonsgegevens = raw.categorieen_persoonsgegevens ?? "";
  vars.beveiligingsmaatregelen = raw.beveiligingsmaatregelen ?? "";
  vars.subverwerkers = raw.subverwerkers ?? "";
  vars.bewaartermijn = raw.bewaartermijn ?? "";
  vars.locatie_verwerking = raw.locatie_verwerking ?? "Europese Economische Ruimte";
  vars.doorgifte_buiten_eer = yesNo(raw.doorgifte_buiten_eer ?? "nee");

  return vars;
}

// ============================================================
// Algemene Voorwaarden transformation
// ============================================================

function transformAlgemeneVoorwaarden(
  raw: Record<string, string>
): DaVariables {
  const vars: DaVariables = {};

  // --- Bedrijfsgegevens ---
  vars.bedrijfsnaam = raw.bedrijfsnaam ?? "";
  vars.kvk_nummer = raw.kvk_nummer ?? "";
  vars.btw_nummer = raw.btw_nummer ?? "";
  vars.vestigingsadres = raw.vestigingsadres ?? "";
  vars.contactgegevens_email = raw.contactgegevens ?? "";
  vars.contactgegevens_telefoon = raw.telefoon ?? "";

  // --- Dienstverlening ---
  vars.diensten_omschrijving = raw.diensten_omschrijving ?? "";
  vars.tarieven = raw.tarieven_betalingstermijn ?? "";
  vars.betaaltermijn = raw.betaaltermijn ?? "14 dagen";

  // --- Juridisch ---
  vars.aansprakelijkheid_beperking = raw.aansprakelijkheid ?? "";
  vars.intellectueel_eigendom = raw.intellectueel_eigendom ?? "";
  vars.geheimhouding = yesNo(raw.geheimhouding ?? "ja");
  vars.opzegtermijn = raw.opzegtermijn ?? "1 maand";

  // --- Klachten ---
  vars.klachtenprocedure = raw.klachtenprocedure ?? "";
  vars.geschillenbeslechting = raw.geschillenbeslechting ?? "Nederlandse rechter";

  // --- Formeel/Informeel ---
  vars.formeel_doc = raw.formeel_informeel ?? "Informeel";
  const informal = vars.formeel_doc === "Informeel";
  vars.persvnwonderwerpinf_lezer = informal ? "je" : "u";
  vars.bezitvnwinf_lezer = informal ? "jouw" : "uw";

  return vars;
}

// ============================================================
// Main dispatcher
// ============================================================

/**
 * Transform raw questionnaire answers to DocAssemble variables.
 * Each document type has its own transformation logic.
 * Documents without a specific transformer pass answers through as-is.
 */
export function transformForDocassemble(
  documentSlug: string,
  rawAnswers: Record<string, string>
): DaVariables {
  switch (documentSlug) {
    case "privacyverklaring-avg":
    case "privacyverklaring":
      return transformPrivacyverklaring(rawAnswers);
    case "overeenkomst-van-opdracht":
      return transformOvereenkomstVanOpdracht(rawAnswers);
    case "verwerkersovereenkomst":
      return transformVerwerkersovereenkomst(rawAnswers);
    case "algemene-voorwaarden":
      return transformAlgemeneVoorwaarden(rawAnswers);
    default:
      // For documents without specific transformation, pass through as-is
      return { ...rawAnswers };
  }
}
