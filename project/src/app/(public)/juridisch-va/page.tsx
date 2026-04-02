import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Juridisch VA worden — Virtually Yours",
  description:
    "In 8 stappen Juridisch VA worden. Van juridische kennis tot netwerken — een complete gids voor startende juridische virtueel assistenten.",
};

export default function JuridischVaPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-20 text-center bg-surface-container-low">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-label text-primary tracking-wide mb-2">Gids</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">
            In 8 stappen Juridisch VA worden
          </h1>
          <p className="mt-4 text-lg text-muted">
            Wil je een Juridisch VA worden? Om een juridisch virtual assistant
            (VA) te worden, heb je een combinatie van juridische kennis,
            technische vaardigheden en zakelijk inzicht nodig. Er zijn
            verschillende stappen die je kunt volgen om aan de slag te gaan als
            juridisch VA.
          </p>
        </div>
      </section>

      {/* Steps */}
      <Section>
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Stap 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-lg">1</span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">Juridische Kennis en Vaardigheden</h2>
            </div>
            <div className="text-muted leading-relaxed space-y-4 pl-[52px]">
              <p>
                Zorg dat je een gedegen juridische achtergrond hebt. Idealiter
                heb je een juridische opleiding in Nederland afgerond, maar ook
                als je nog niet bent afgestudeerd kun je al starten als Juridisch
                VA. Ruime werkervaring binnen de juridische sector (bijvoorbeeld
                als juridisch secretaresse) kan ook voldoende zijn.
              </p>
              <p>
                Ontwikkel de praktische vaardigheden om veelvoorkomende
                juridische werkzaamheden goed uit te kunnen voeren. Dit omvat
                het kunnen opstellen of bewerken van juridische documenten, het
                kunnen uitvoeren van juridisch onderzoek en in staat zijn
                klanten te adviseren over juridische kwesties.
              </p>
            </div>
          </div>

          {/* Stap 2 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-lg">2</span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">Gespecialiseerd Juridisch VA Worden</h2>
            </div>
            <div className="text-muted leading-relaxed space-y-4 pl-[52px]">
              <p>
                Overweeg om een gespecialiseerd Juridisch VA te worden door een
                specifiek rechtsgebied te kiezen waarin je je wilt
                specialiseren, zoals arbeidsrecht, ondernemingsrecht,
                familierecht, strafrecht, of vastgoedrecht.
              </p>
              <p>
                Bepaal welk type werkzaamheden je wilt aanbieden, zoals
                administratief werkzaamheden, klantencontact, copywriting of
                marketing.
              </p>
            </div>
          </div>

          {/* Stap 3 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-lg">3</span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">Freelance Juridisch VA Worden (Inschrijving bij KvK)</h2>
            </div>
            <div className="text-muted leading-relaxed space-y-4 pl-[52px]">
              <p>
                Wil je freelance juridisch VA worden (en dus niet in loondienst
                werken), dan dien je je in te schrijven bij de Kamer van
                Koophandel (KvK). Ga naar de website van de KvK (www.kvk.nl) en
                zoek naar informatie over de inschrijvingsprocedure voor
                zelfstandig ondernemers.
              </p>
              <p>
                Overweeg de juiste rechtsvorm voor je bedrijf, bijvoorbeeld een
                eenmanszaak, besloten vennootschap (BV), of een andere
                rechtsvorm die het beste past bij je situatie. In de meeste
                gevallen zal een Juridisch VA starten als eenmanszaak.
              </p>
            </div>
          </div>

          {/* Stap 4 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-lg">4</span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">Verdiep je in het Zelfstandig Ondernemerschap</h2>
            </div>
            <div className="text-muted leading-relaxed space-y-4 pl-[52px]">
              <p>
                Als je als freelancer aan de slag wilt gaan, moet je je
                verdiepen in het zelfstandig ondernemerschap. Raadpleeg een
                juridisch en/of fiscaal adviseur om te zorgen dat je voldoet aan
                alle wettelijke en belastingvereisten.
              </p>
              <p>
                Denk hierbij aan zaken als het urencriterium, het voorkomen van
                schijnzelfstandigheid en het voeren van een juiste boekhouding.
              </p>
              <p>
                Overweeg het afsluiten van relevante zakelijke verzekeringen,
                zoals een bedrijfsaansprakelijkheidsverzekering (AVB) en een
                beroepsaansprakelijkheidsverzekering (BAV) om jezelf te
                beschermen tegen mogelijke juridische en financi&euml;le
                risico&apos;s. Dit is niet wettelijk verplicht.
              </p>
              <p>
                Overweeg het openen van een zakelijke bankrekening. Een zakelijke
                rekening is niet verplicht, maar zorgt er wel voor dat je je
                priv&eacute;uitgaven en zakelijke uitgaven apart houdt.
              </p>
              <p>
                Overweeg het afsluiten van een zakelijk telefoonabonnement. Dit
                kan prettig zijn om een apart telefoonnummer te gebruiken voor je
                onderneming.
              </p>
            </div>
          </div>

          {/* Stap 5 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-lg">5</span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">Tarieven en Dienstverleningsovereenkomsten</h2>
            </div>
            <div className="text-muted leading-relaxed space-y-4 pl-[52px]">
              <p>
                Bepaal je tarieven op basis van je ervaring, specialisatie, de
                concurrentie, en je eigen financi&euml;le positie. Vaak werkt
                een Juridisch VA op basis van een uurtarief, maar het is ook
                mogelijk om op projectbasis te werken.
              </p>
              <p>
                Houd bij je berekeningen en in je communicatie naar
                opdrachtgevers rekening met de btw-afdracht. Als je met zakelijk
                opdrachtgevers werkt (B2B) reken je meestal met bedragen
                exclusief btw, terwijl je naar particulieren (B2C) vaker werkt
                met bedragen inclusief btw.
              </p>
              <p>
                Stel algemene voorwaarden op voor juridische bescherming, om
                misverstanden te voorkomen en risico&apos;s te beperken. Het is
                niet verplicht, maar wel verstandig, om te werken met algemene
                voorwaarden. Je kunt je algemene voorwaarden zelf opstellen,
                maar als je niet voldoende kennis hebt, kun je dit het beste
                uitbesteden aan een gespecialiseerd jurist.
              </p>
              <p>
                Stel duidelijke dienstverleningsovereenkomsten op (bijvoorbeeld
                een overeenkomst van opdracht) om de verwachtingen en
                verantwoordelijkheden van jou en je opdrachtgevers vast te
                leggen.
              </p>
            </div>
          </div>

          {/* Stap 6 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-lg">6</span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">Technische Vaardigheden en Tools</h2>
            </div>
            <div className="text-muted leading-relaxed space-y-4 pl-[52px]">
              <p>
                Leer technische vaardigheden die nodig zijn voor het werken als
                virtual assistant (VA), zoals het beheren van een website, het
                gebruik van online tools en platforms. Verdiep je in het
                bijzonder in de mogelijkheden van online samenwerkingstools zoals
                Google Drive, Trello, Microsoft Teams, Zoom, en Slack.
              </p>
              <p>
                Leer technologische tools en software gebruiken die relevant
                zijn voor juridische VA&apos;s, zoals documentbeheersystemen,
                tekstverwerkingstools, AI tools, online samenwerkingsplatforms
                en juridische onderzoeksdatabases.
              </p>
            </div>
          </div>

          {/* Stap 7 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-lg">7</span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">Online Aanwezigheid Opbouwen</h2>
            </div>
            <div className="text-muted leading-relaxed space-y-4 pl-[52px]">
              <p>
                Om zichtbaar te zijn voor potenti&euml;le opdrachtgevers moet je
                je online aanwezigheid opbouwen. Cre&euml;er een professionele
                website waarop je jouw diensten als juridische VA aanbiedt. Dit
                kan ook dienen als platform om je expertise te delen via
                blogposts en artikelen.
              </p>
              <p>
                Maak gebruik van sociale media en online platforms (bijvoorbeeld
                Instagram, LinkedIn, Facebook) om jezelf te promoten en je
                diensten onder de aandacht te brengen.
              </p>
              <p>
                Overweeg om een logo, en eventueel een huisstijl, te laten
                ontwerpen. Dit is in beginsel niet noodzakelijk, maar geeft wel
                een professionele uitstraling. Je kunt hiervoor een designer
                inhuren of overwegen om een logo te laten ontwerpen door een
                freelancer in het buitenland, bijvoorbeeld op een platform als
                Fiverr.
              </p>
            </div>
          </div>

          {/* Stap 8 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-lg">8</span>
              <h2 className="font-serif text-2xl font-bold text-on-surface">Netwerken</h2>
            </div>
            <div className="text-muted leading-relaxed space-y-4 pl-[52px]">
              <p>
                Voor je zichtbaarheid bij potenti&euml;le opdrachtgevers is het
                belangrijk om naast online zichtbaarheid, ook face-to-face te
                netwerken. Neem deel aan juridische en zakelijke
                netwerkevenementen om contacten te leggen en potenti&euml;le
                klanten te ontmoeten.
              </p>
              <p>
                Laat je eigen omgeving en netwerk weten dat je bent begonnen als
                Juridisch VA en dat je beschikbaar bent voor opdrachten. Vaak
                komen de eerste opdrachten van een startend VA vanuit het eigen
                netwerk.
              </p>
            </div>
          </div>

          {/* Vier je Mijlpalen */}
          <div className="rounded-lg bg-surface-container-low p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">Vier je Mijlpalen!</h2>
            <p className="text-muted leading-relaxed">
              Het is niet niks om een onderneming van de grond af op te bouwen.
              Juridisch VA worden vergt tijd, inzet en energie. Vergeet daarom
              ook niet om stil te staan bij al je mijlpalen! Vier het als je
              inschrijving bij de KvK is gelukt. Toast op je nieuwe website die
              live gaat. Toon met trots je nieuw ontworpen logo. En last but not
              least&hellip; Vier het als je je eerste opdracht binnen hebt
              gehaald!
            </p>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section bg="bg-sidebar">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-lg bg-card border border-card-border p-6 sm:p-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
              Hulp nodig bij het starten?
            </h2>
            <p className="mt-4 text-muted">
              Ik begeleid startende juridische VA&apos;s bij het opzetten van hun
              praktijk. Neem gerust contact op voor een vrijblijvend
              kennismakingsgesprek.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/contact" size="lg">
                Neem contact op
              </Button>
              <Button href="/documenten" variant="secondary" size="lg">
                Bekijk documenten
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
