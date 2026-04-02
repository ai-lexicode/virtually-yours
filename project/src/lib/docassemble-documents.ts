/**
 * Docassemble document configurations for Virtually Yours.
 *
 * Each document config defines the metadata, pricing, and
 * Docassemble interview integration for a legal document type.
 */

export interface DocumentConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  price_cents: number;
  interview_name: string;
  required_fields: string[];
}

export const vyDocuments: DocumentConfig[] = [
  {
    id: "vy-doc-001",
    slug: "privacyverklaring",
    title: "Privacyverklaring",
    description:
      "Een privacyverklaring op maat voor virtueel assistenten en online professionals die persoonsgegevens van klanten verwerken. Voldoet aan de AVG/GDPR.",
    price_cents: 4900,
    interview_name: "docassemble.virtually-yours:data/questions/privacyverklaring.yml",
    required_fields: [
      "bedrijfsnaam",
      "kvk_nummer",
      "rechtsvorm",
      "voornaam",
      "achternaam",
      "email_privacyverklaring",
      "verwerkingsdoelen",
      "contact_mogelijkheden",
      "technische_maatregelen",
      "organisatorische_maatregelen",
    ],
  },
  {
    id: "vy-doc-002",
    slug: "verwerkersovereenkomst",
    title: "Verwerkersovereenkomst",
    description:
      "Een verwerkersovereenkomst tussen u als VA/online professional en uw opdrachtgever. Verplicht wanneer u als verwerker persoonsgegevens verwerkt namens een klant.",
    price_cents: 5900,
    interview_name: "docassemble.virtually-yours:data/questions/verwerkersovereenkomst.yml",
    required_fields: [
      "verwerker_bedrijfsnaam",
      "verwerker_kvk",
      "verwerker_adres",
      "verwerkingsverantwoordelijke_bedrijfsnaam",
      "verwerkingsverantwoordelijke_kvk",
      "verwerkingsverantwoordelijke_adres",
      "verwerkingsdoel",
      "categorieen_betrokkenen",
      "categorieen_persoonsgegevens",
      "beveiligingsmaatregelen",
      "subverwerkers",
      "bewaartermijn",
    ],
  },
  {
    id: "vy-doc-003",
    slug: "algemene-voorwaarden",
    title: "Algemene Voorwaarden",
    description:
      "Algemene voorwaarden voor online dienstverleners, VA's en freelancers. Beschermt u juridisch en schept duidelijkheid voor uw klanten over uw dienstverlening.",
    price_cents: 6900,
    interview_name: "docassemble.virtually-yours:data/questions/algemene-voorwaarden.yml",
    required_fields: [
      "bedrijfsnaam",
      "kvk_nummer",
      "btw_nummer",
      "vestigingsadres",
      "contactgegevens",
      "diensten_omschrijving",
      "tarieven_betalingstermijn",
      "aansprakelijkheid",
      "intellectueel_eigendom",
      "geheimhouding",
      "opzegtermijn",
      "klachtenprocedure",
    ],
  },
  {
    id: "vy-doc-004",
    slug: "overeenkomst-van-opdracht",
    title: "Overeenkomst van Opdracht",
    description:
      "Een overeenkomst van opdracht op maat voor freelancers en VA's. Inclusief facturatieafspraken, werkzaamheden, IE-rechten en algemene voorwaarden. Geschikt voor eenmanszaken en zzp'ers.",
    price_cents: 10900,
    interview_name: "docassemble.opdrachtdocsp03:data/questions/Yaml_opdr_p03y30.yml",
    required_fields: [
      "bedrijfsnaam",
      "kvk_nummer",
      "voornaam",
      "achternaam",
      "werkzaamheden",
    ],
  },
];

/**
 * Look up a document config by slug.
 */
export function getDocumentBySlug(slug: string): DocumentConfig | undefined {
  return vyDocuments.find((doc) => doc.slug === slug);
}

/**
 * Get all active document configs.
 */
export function getAllDocuments(): DocumentConfig[] {
  return vyDocuments;
}
