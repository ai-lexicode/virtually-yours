import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Over mij — Virtually Yours",
  description:
    "Maak kennis met Risha Smeding — freelance jurist, Legal Engineer & Juridisch VA.",
};

export default function OverMijPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 sm:py-20" style={{ backgroundImage: "url('/images/about-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-lg overflow-hidden border border-card-border shadow-lg">
                <Image
                  src="/images/profile-risha.jpg"
                  alt="Risha Smeding"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="text-label text-primary tracking-wide mb-2">
                Over mij
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">Risha Smeding</h1>
              <p className="mt-2 text-lg text-primary font-medium">
                Freelance jurist, Legal Engineer &amp; Juridisch VA
              </p>

              <div className="mt-6 space-y-4 text-muted leading-relaxed">
                <p>
                  Al enige jaren ben ik werkzaam als virtueel assistent en online
                  business manager. Nadat ik Rechtsgeleerdheid was gaan studeren
                  aan de Open Universiteit, ben ik mij als VA volledig gaan
                  richten op de juridische niche. De beste keuze ever! Want hoe
                  leuk is het om juridisch VA te zijn.
                </p>
                <p>
                  Als juridisch VA help ik online ondernemers aan een goed
                  juridisch fundament van hun onderneming. Denk hierbij aan
                  juridische documenten zoals algemene voorwaarden,
                  privacyverklaringen en verwerkersovereenkomsten, specifiek
                  afgestemd op de situatie van de ondernemer.
                </p>
                <p>
                  Omdat ik zelf werkzaam ben als VA en werkzaam ben geweest als
                  OBM en SMM, kan ik juridische documenten opstellen die, zowel
                  juridisch als praktisch, volledig zijn gericht op de behoeften
                  van virtueel professionals.
                </p>
                <p>
                  Ik ondersteun ook juridische dienstverleners, zoals
                  adviesbureaus en advocatenkantoren. Mijn werkzaamheden voer ik
                  remote uit. Het is dus geen probleem als je niet beschikt over
                  een kantoorruimte of een werkplek voor mij.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button href="/contact">Neem contact op</Button>
                <Button href="/documenten" variant="secondary">
                  Bekijk documenten
                </Button>
              </div>

              <div className="mt-6">
                <Image
                  src="/images/signature.png"
                  alt="Signature"
                  width={150}
                  height={60}
                />
              </div>
            </div>
          </div>

          {/* Second photo section */}
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-2xl h-80 rounded-lg overflow-hidden border border-card-border shadow-lg">
              <Image
                src="/images/risha-justitia.jpg"
                alt="Risha met Lady Justice"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Personal story */}
      <Section title="Wie ben ik?" bg="bg-card">
        <div className="max-w-3xl mx-auto space-y-6 text-muted leading-relaxed">
          <p>
            Wat leuk dat je hier op mijn website terecht bent gekomen! Als jij opzoek bent naar een juridisch VA,
            of iemand die jouw juridische documenten op orde kan maken, ben je hier aan het goede adres!
            Maar… dan wil je natuurlijk wel weten wat voor vlees je in de kuip hebt. Dus zie hier,
            mijn levensverhaal in een paar zinnen.
          </p>

          <h3 className="font-serif text-xl font-bold text-on-surface pt-4">Mijn jeugd</h3>
          <p>
            Sinds ik in 1986 in het pittoreske Vught (Noord-Brabant) voor het eerst het levenslicht zag,
            ga ik door het leven als Risha Smeding. Jongste uit een gezin van vier kinderen, totdat mijn
            broertje werd geboren toen ik 15 jaar was, en de teller ineens op vijf kinderen stond. Van
            origine ben ik dus Brabantse, maar inmiddels al vele jaren woonachtig boven de rivieren.
          </p>

          <h3 className="font-serif text-xl font-bold text-on-surface pt-4">Leiden</h3>
          <p>
            Het grootste deel van mijn leven heb ik echter in Leiden gewoond. Ik heb daar dan ook gestudeerd
            aan de Universiteit Leiden. Archeologie, om precies te zijn. Daarna heb ik mij gespecialiseerd in
            DNA-onderzoek op menselijk skeletmateriaal en enkele jaren als wetenschappelijk onderzoeker gewerkt
            in het LUMC. De laatste jaren woonde ik in Leiden in een fantastisch leuk monumentaal pandje in het
            centrum. Maar met de komst van twee energieke zoontjes, was dat niet langer de ideale plek.
          </p>

          <h3 className="font-serif text-xl font-bold text-on-surface pt-4">Buuf</h3>
          <p>
            In 2021 bleek het lot mij goed gezind! Er kwam een woning vrij in Alphen aan den Rijn, in een
            kindvriendelijke buurt, twee deuren verder van mijn zus. Ondanks de gekte op de huizenmarkt, ben ik
            nu de buuf van mijn zus en woon ik daar, als alleenstaande moeder, heel fijn met mijn twee geweldige zoontjes.
          </p>

          <h3 className="font-serif text-xl font-bold text-on-surface pt-4">Ondernemerschap</h3>
          <p>
            In Alphen aan den Rijn werk ik heerlijk vanuit huis als online ondernemer. Mijn ondernemersavontuur
            begon reeds in 2014, toen ik samen met mijn toenmalige partner de KvK binnenstapte om onze salsa
            dansschool in te schrijven. Daar heb ik enkele jaren mijn ziel en zaligheid in gelegd. Maar in 2019
            was het tijd voor een nieuwe uitdaging: freelance virtual assistant (VA).
          </p>

          <h3 className="font-serif text-xl font-bold text-on-surface pt-4">Juridische niche</h3>
          <p>
            Nadat ik Rechtsgeleerdheid was gaan studeren aan de Open Universiteit, ben ik mij als VA volledig
            gaan richten op de juridische niche. De beste keuze ever! Want hoe leuk is het om juridisch VA te zijn!
          </p>

          <h3 className="font-serif text-xl font-bold text-on-surface pt-4">Meer weten?</h3>
          <p>
            Dat ben ik, in grote lijnen. Maar ik heb je nog niet verteld over mijn opleiding Camerajournalistiek,
            mijn opleiding Digitaal Rechercheur, mijn semester aan de Universiteit in Argentinië, mijn
            prijzenwinnende lezingen, mijn wetenschappelijke publicaties, of mijn werk bij het NFI… enzo.
            Neem dus ook eens een kijkje op mijn Instagram en mijn LinkedIn-profiel en stuur me gerust een connectieverzoek!
          </p>
        </div>
      </Section>

      {/* Professional profile */}
      <Section title="Professioneel profiel" bg="bg-surface-elevated">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-on-surface">Werkervaring</h3>
            <p className="text-sm text-muted leading-relaxed">
              Sinds 2019 werk ik als freelance Virtual Assistant. Hiervoor heb ik een kort uitstapje gemaakt
              naar een marketingafdeling waar ik als content creator gewerkt heb. Daarvoor heb ik jarenlang
              als wetenschappelijk DNA-Onderzoeker gewerkt op een Forensisch Laboratorium en ben ik ondernemer
              geweest in de culturele sector.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-on-surface">Opleidingen</h3>
            <p className="text-sm text-muted leading-relaxed">
              Momenteel studeer ik Rechtsgeleerdheid aan de Open Universiteit. Ik heb tevens een opleiding
              Juridische Vaardigheden succesvol afgerond. Daarnaast ben ik geschoold in menselijk skeletonderzoek
              en humaan DNA-onderzoek.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-on-surface">Talenkennis</h3>
            <p className="text-sm text-muted leading-relaxed">
              Nederlands is mijn moedertaal. Daarnaast beheers ik de Engelse taal uitstekend. Gedurende mijn
              studententijd heb ik enkele jaren Spaans gestudeerd aan de Universiteit Leiden, en ik heb tevens
              enkele maanden in Latijns-Amerika gewoond en gestudeerd. De Spaanse taal beheers ik dan ook goed.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-on-surface">Publicaties</h3>
            <p className="text-sm text-muted leading-relaxed">
              Als wetenschappelijk DNA-onderzoeker in een forensisch laboratorium heb ik meerdere artikelen
              gepubliceerd en diverse bijdragen geleverd aan o.a. boeken. Een overzicht van enkele van mijn
              publicaties is te vinden op mijn LinkedIn-pagina.
            </p>
          </div>
        </div>
      </Section>

      {/* Services detail */}
      <Section
        title="Mijn diensten"
        subtitle="Ik bied drie kernservices aan voor online ondernemers en juridische dienstverleners."
        bg="bg-sidebar"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Juridisch VA (remote)",
              description:
                "Als Juridisch Virtual Assistant (VA) ondersteun ik juridische dienstverleners op afstand. Hoewel ik in overleg (deels) bij jou op locatie kan komen werken, werk ik doorgaans remote. Het is dus in beginsel niet nodig om een werkplek beschikbaar te stellen voor mij.",
              icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0",
            },
            {
              title: "Juridische Documenten voor VA's",
              description:
                "Als Virtual Assistant (VA) is het belangrijk dat je het juridisch fundament van jouw onderneming goed op orde hebt. Dit om aansprakelijkheid, schijnzelfstandigheid, misverstanden en conflicten te voorkomen. Vanuit mijn eigen ervaring als VA bied ik juridische documenten aan die helemaal toegespitst zijn op VA's.",
              icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
            },
            {
              title: "Coaching van startende Juridische VA's",
              description:
                "Ik begeleid startende virtual assistants die zich wil richten op de juridische sector. Door middel van losse coachingsessies of een coachingtraject zorg ik dat jij binnen no time van start kan gaan met jouw onderneming.",
              icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
            },
          ].map((service) => (
            <div
              key={service.title}
              className="rounded-lg bg-card p-6 border border-card-border"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 mb-4">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={service.icon}
                  />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-on-surface">{service.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-lg bg-card border border-card-border p-6 sm:p-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
              Wil je samenwerken?
            </h2>
            <p className="mt-4 text-muted">
              Neem gerust contact op voor een vrijblijvend kennismakingsgesprek.
            </p>
            <div className="mt-8">
              <Button href="/contact" size="lg">
                Neem contact op
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
