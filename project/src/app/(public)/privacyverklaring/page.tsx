import Link from "next/link";

export const metadata = {
  title: "Privacyverklaring — Virtually Yours",
};

export default function PrivacyverklaringPage() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          &gt; Privacyverklaring
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Privacyverklaring</h1>
        <p className="text-sm text-muted mb-10">
          Laatst bijgewerkt: 1 maart 2026
        </p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. Wie zijn wij?
            </h2>
            <p className="text-muted">
              Virtually Yours is gevestigd te Alphen
              aan den Rijn (KvK: 76053881). Wij zijn verantwoordelijk voor de
              verwerking van uw persoonsgegevens zoals beschreven in deze
              privacyverklaring.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. Welke gegevens verwerken wij?
            </h2>
            <p className="text-muted">Wij verwerken de volgende gegevens:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              <li>
                <strong className="text-foreground">
                  Accountgegevens:
                </strong>{" "}
                naam, e-mailadres, bedrijfsnaam, KvK-nummer, BTW-nummer,
                telefoonnummer
              </li>
              <li>
                <strong className="text-foreground">
                  Betalingsgegevens:
                </strong>{" "}
                betaalmethode, transactie-informatie (via Mollie)
              </li>
              <li>
                <strong className="text-foreground">
                  Vragenlijstgegevens:
                </strong>{" "}
                de antwoorden die u invult om uw document te genereren
              </li>
              <li>
                <strong className="text-foreground">
                  Technische gegevens:
                </strong>{" "}
                IP-adres, browsertype, bezochte pagina&apos;s (via cookies)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. Waarvoor gebruiken wij uw gegevens?
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              <li>
                Het aanmaken en beheren van uw account
              </li>
              <li>
                Het verwerken van bestellingen en betalingen
              </li>
              <li>
                Het genereren van juridische documenten op basis van uw
                antwoorden
              </li>
              <li>
                Het versturen van bevestigingsmails en notificaties
              </li>
              <li>
                Het verbeteren van onze dienstverlening
              </li>
              <li>
                Het voldoen aan wettelijke verplichtingen (fiscale
                bewaarplicht)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Rechtsgrondslag
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              <li>
                <strong className="text-foreground">
                  Uitvoering overeenkomst:
                </strong>{" "}
                account, bestellingen, documentgeneratie
              </li>
              <li>
                <strong className="text-foreground">
                  Wettelijke verplichting:
                </strong>{" "}
                factuurgegevens, fiscale bewaarplicht
              </li>
              <li>
                <strong className="text-foreground">
                  Gerechtvaardigd belang:
                </strong>{" "}
                verbetering dienstverlening, beveiliging
              </li>
              <li>
                <strong className="text-foreground">Toestemming:</strong>{" "}
                nieuwsbrief (optioneel)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              5. Delen met derden
            </h2>
            <p className="text-muted">
              Wij delen uw gegevens alleen met de volgende partijen, voor
              zover noodzakelijk:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              <li>
                <strong className="text-foreground">Mollie:</strong>{" "}
                betalingsverwerking
              </li>
              <li>
                <strong className="text-foreground">Supabase:</strong>{" "}
                hosting van de database (EU-regio)
              </li>
              <li>
                <strong className="text-foreground">Resend:</strong>{" "}
                versturen van transactionele e-mails
              </li>
              <li>
                <strong className="text-foreground">Vercel:</strong>{" "}
                hosting van de website
              </li>
            </ul>
            <p className="text-muted mt-2">
              Met deze verwerkers hebben wij verwerkersovereenkomsten
              gesloten.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              6. Bewaartermijnen
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              <li>
                Accountgegevens: zolang u een account heeft, plus 1 jaar na
                verwijdering
              </li>
              <li>
                Bestellingen en facturen: 7 jaar (wettelijke bewaarplicht)
              </li>
              <li>
                Gegenereerde documenten: 90 dagen na levering beschikbaar
                voor download
              </li>
              <li>
                Vragenlijstantwoorden: worden verwijderd na documentgeneratie
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              7. Uw rechten
            </h2>
            <p className="text-muted">
              Op grond van de AVG heeft u de volgende rechten:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted">
              <li>
                <strong className="text-foreground">Inzage:</strong> u kunt
                opvragen welke gegevens wij van u hebben
              </li>
              <li>
                <strong className="text-foreground">Rectificatie:</strong> u
                kunt onjuiste gegevens laten corrigeren
              </li>
              <li>
                <strong className="text-foreground">Verwijdering:</strong> u
                kunt verzoeken uw gegevens te wissen
              </li>
              <li>
                <strong className="text-foreground">Overdraagbaarheid:</strong>{" "}
                u kunt uw gegevens in een gangbaar formaat ontvangen
              </li>
              <li>
                <strong className="text-foreground">Bezwaar:</strong> u kunt
                bezwaar maken tegen verwerking op basis van gerechtvaardigd
                belang
              </li>
            </ul>
            <p className="text-muted mt-2">
              Neem contact op via{" "}
              <a
                href="mailto:privacy@virtually-yours.nl"
                className="text-primary hover:text-primary-hover"
              >
                privacy@virtually-yours.nl
              </a>{" "}
              om uw rechten uit te oefenen. Wij reageren binnen 30 dagen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              8. Cookies
            </h2>
            <p className="text-muted">
              Wij gebruiken alleen functionele cookies die noodzakelijk zijn
              voor het functioneren van de website (sessie, authenticatie). Wij
              gebruiken geen tracking- of marketingcookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              9. Beveiliging
            </h2>
            <p className="text-muted">
              Wij nemen passende technische en organisatorische maatregelen om
              uw persoonsgegevens te beschermen, waaronder SSL-encryptie,
              toegangscontrole op basis van Row Level Security, en regelmatige
              back-ups.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              10. Klachten
            </h2>
            <p className="text-muted">
              Bent u niet tevreden over hoe wij met uw gegevens omgaan? U kunt
              een klacht indienen bij de{" "}
              <a
                href="https://autoriteitpersoonsgegevens.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-hover"
              >
                Autoriteit Persoonsgegevens
              </a>
              .
            </p>
          </section>

          <section className="border-t border-card-border pt-6">
            <h2 className="text-xl font-semibold text-foreground">
              Contactgegevens
            </h2>
            <div className="text-muted space-y-1">
              <p>Virtually Yours</p>
              <p>Wikkestraat 68, Alphen aan den Rijn</p>
              <p>KvK: 76053881</p>
              <p>
                Privacy:{" "}
                <a
                  href="mailto:privacy@virtually-yours.nl"
                  className="text-primary hover:text-primary-hover"
                >
                  privacy@virtually-yours.nl
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
