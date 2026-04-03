import Link from "next/link";

export const metadata = {
  title: "Algemene Voorwaarden — Virtually Yours",
};

export default function AlgemeneVoorwaardenPage() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>{" "}
          &gt; Algemene Voorwaarden
        </p>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2 text-on-surface">Algemene Voorwaarden</h1>
        <p className="text-sm text-muted mb-10 font-label">
          Laatst bijgewerkt: 1 maart 2026
        </p>

        <div className="prose prose-sm max-w-none space-y-8 text-on-surface/90">
          <section>
            <h2 className="font-serif text-xl font-bold text-on-surface">Artikel 1 — Definities</h2>
            <p>In deze algemene voorwaarden wordt verstaan onder:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              <li><strong className="text-on-surface">Virtually Yours:</strong> de eenmanszaak Virtually Yours, gevestigd te Alphen aan den Rijn, KvK-nummer 76053881.</li>
              <li><strong className="text-on-surface">Klant:</strong> de natuurlijke persoon of rechtspersoon die een overeenkomst aangaat met Virtually Yours.</li>
              <li><strong className="text-on-surface">Dienst:</strong> het genereren van juridische documenten op basis van door de Klant verstrekte informatie via de online vragenlijst.</li>
              <li><strong className="text-on-surface">Document:</strong> het door Virtually Yours gegenereerde juridische document (PDF/DOCX).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-on-surface">Artikel 2 — Toepasselijkheid</h2>
            <p className="text-muted">
              Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes en overeenkomsten tussen Virtually Yours en de Klant. Door het plaatsen van een bestelling accepteert de Klant deze voorwaarden.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-on-surface">Artikel 3 — Aanbod en Prijzen</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              <li>Alle prijzen op de website zijn in euro&apos;s en inclusief 21% BTW.</li>
              <li>Virtually Yours behoudt zich het recht voor om prijzen te wijzigen. Reeds geplaatste bestellingen worden niet beïnvloed door prijswijzigingen.</li>
              <li>Aanbiedingen zijn geldig zolang ze op de website worden weergegeven.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-on-surface">Artikel 4 — Bestelling en Betaling</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              <li>De overeenkomst komt tot stand op het moment dat de betaling is ontvangen.</li>
              <li>Betaling geschiedt via de betalingsprovider Stripe. Virtually Yours accepteert iDEAL en creditcard (Visa, Mastercard).</li>
              <li>Na betaling ontvangt de Klant een bevestigingse-mail en toegang tot de vragenlijst.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-on-surface">Artikel 5 — Levering</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              <li>Na het invullen van de vragenlijst wordt het document gegenereerd en — indien van toepassing — beoordeeld door een jurist.</li>
              <li>De verwachte levertijd is afhankelijk van het documenttype en wordt op de productpagina aangegeven.</li>
              <li>Levering geschiedt digitaal via het klantenportaal op virtually-yours.nl.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-on-surface">Artikel 6 — Herroepingsrecht</h2>
            <p className="text-muted">
              Op grond van artikel 6:230p sub d BW vervalt het herroepingsrecht zodra de Klant de vragenlijst invult en het document op maat wordt gegenereerd. Door het starten van de vragenlijst stemt de Klant ermee in dat de levering van de digitale inhoud direct begint en dat het herroepingsrecht daarmee vervalt.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-on-surface">Artikel 7 — Aansprakelijkheid</h2>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              <li>De door Virtually Yours gegenereerde documenten zijn gebaseerd op de door de Klant verstrekte informatie en gelden als een startpunt. Virtually Yours is geen advocatenkantoor en biedt geen juridisch advies.</li>
              <li>Virtually Yours is niet aansprakelijk voor schade die voortvloeit uit het gebruik van de gegenereerde documenten.</li>
              <li>De aansprakelijkheid van Virtually Yours is te allen tijde beperkt tot het bedrag dat de Klant voor het betreffende document heeft betaald.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-on-surface">Artikel 8 — Intellectueel Eigendom</h2>
            <p className="text-muted">
              De templates en software van Virtually Yours zijn en blijven eigendom van Virtually Yours. Na betaling verkrijgt de Klant een niet-exclusief gebruiksrecht op het voor hem gegenereerde document.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-on-surface">Artikel 9 — Klachten</h2>
            <p className="text-muted">
              Klachten over de dienstverlening dienen binnen 14 dagen na levering schriftelijk te worden gemeld via{" "}
              <a href="mailto:info@virtually-yours.nl" className="text-secondary hover:text-secondary/80">
                info@virtually-yours.nl
              </a>. Virtually Yours streeft ernaar klachten binnen 5 werkdagen te behandelen.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-on-surface">Artikel 10 — Toepasselijk Recht</h2>
            <p className="text-muted">
              Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement Den Haag.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="font-serif text-xl font-bold text-on-surface">Contactgegevens</h2>
            <div className="text-muted space-y-1">
              <p>Virtually Yours</p>
              <p>Wikkestraat 68, Alphen aan den Rijn</p>
              <p>KvK: 76053881</p>
              <p>BTW: NL003038893B59</p>
              <p>
                E-mail:{" "}
                <a href="mailto:info@virtually-yours.nl" className="text-secondary hover:text-secondary/80">
                  info@virtually-yours.nl
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
