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
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 bg-background border-b border-card-border">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -translate-y-1/3" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Bio */}
            <div className="order-2 lg:order-1 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="w-10 h-[2px] bg-primary rounded-full"></span>
                <p className="text-label text-primary tracking-widest uppercase">Over mij</p>
              </div>
              
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-on-surface leading-tight">
                Risha <span className="text-primary italic font-light">Smeding</span>
              </h1>
              
              <p className="mt-5 text-xl sm:text-2xl text-white/90 font-medium tracking-wide">
                Freelance jurist, Legal Engineer &amp; Juridisch VA
              </p>

              <div className="mt-8 space-y-5 text-muted leading-relaxed text-base sm:text-lg border-l-2 border-primary/20 pl-6">
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
                  privacyverklaringen en verwerkersovereenkomsten.
                </p>
                <p>
                  Omdat ik zelf werkzaam ben als VA en werkzaam ben geweest als
                  OBM en SMM, kan ik juridische documenten opstellen die, zowel
                  juridisch als praktisch, volledig zijn gericht op de behoeften
                  van virtueel professionals.
                </p>
                <p>
                  Ik ondersteun ook juridische dienstverleners rechtstreeks. Mijn werkzaamheden voer ik
                  remote uit. Het is dus geen probleem als je niet beschikt over
                  een kantoorruimte.
                </p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button href="/contact" size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">Neem contact op</Button>
                <Button href="/documenten" variant="secondary" size="lg" className="w-full sm:w-auto">
                  Bekijk documenten
                </Button>
              </div>

              <div className="mt-12 opacity-90 inline-block drop-shadow-[0_0_15px_rgba(200,156,111,0.2)]">
                <Image
                  src="/images/signature.png"
                  alt="Signature"
                  width={180}
                  height={80}
                />
              </div>
            </div>

            {/* Photo */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in-up delay-200">
              <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-tl-full rounded-tr-full overflow-hidden shadow-2xl group border border-primary/30 bg-surface-container">
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10 pointer-events-none" />
                <Image
                  src="/images/profile-risha-premium.png"
                  alt="Risha Smeding"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 border-[1px] border-white/10 rounded-tl-full rounded-tr-full z-20 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal story — with Justitia background */}
      <section className="relative py-24 sm:py-32 overflow-hidden border-b border-card-border">
        <Image
          src="/images/risha-justitia.jpg"
          alt="Risha met Lady Justice"
          fill
          className="object-cover fixed"
          priority={false}
        />
        <div className="absolute inset-0 bg-background/90 md:bg-background/85 backdrop-blur-sm" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-label text-primary tracking-wide mb-3">Mijn Reis</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Wie ben ik?</h2>
            <div className="mx-auto h-[2px] w-16 bg-primary rounded-full mb-8" />
            <p className="max-w-2xl mx-auto text-lg text-white/80 leading-relaxed">
              Wat leuk dat je hier op mijn website terecht bent gekomen! Als jij opzoek bent naar een juridisch VA,
              of iemand die jouw juridische documenten op orde kan maken, ben je hier aan het goede adres!
              Maar… dan wil je natuurlijk wel weten wat voor vlees je in de kuip hebt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto animate-fade-in-up delay-200">
            {[
              {
                title: "Mijn jeugd",
                content: "Sinds ik in 1986 in het pittoreske Vught (Noord-Brabant) voor het eerst het levenslicht zag, ga ik door het leven als Risha Smeding. Jongste uit een gezin van vier kinderen, totdat mijn broertje werd geboren toen ik 15 jaar was. Van origine dus Brabantse, maar inmiddels woonachtig boven de rivieren.",
                icon: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              },
              {
                title: "Leiden",
                content: "Het grootste deel van mijn leven heb ik echter in Leiden gewoond. Ik heb daar gestudeerd aan de Universiteit Leiden (Archeologie). Daarna mij gespecialiseerd in DNA-onderzoek op skeletmateriaal en gewerkt in het LUMC. De laatste jaren woonde ik in een prachtig monumentaal pandje in het centrum.",
                icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347"
              },
              {
                title: "Ondernemerschap",
                content: "In Alphen aan den Rijn werk ik heerlijk vanuit huis als online ondernemer. Mijn avontuur begon in 2014 toen we onze salsa dansschool startten. Daar heb ik jarenlang mijn ziel en zaligheid in gelegd. Maar in 2019 was het tijd voor een nieuwe uitdaging: freelance virtual assistant (VA).",
                icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58"
              },
              {
                title: "Juridische niche",
                content: "Nadat ik Rechtsgeleerdheid was gaan studeren aan de Open Universiteit, ben ik mij als VA volledig gaan richten op de juridische niche. De beste keuze ever! Want hoe leuk is het om juridisch VA te zijn!",
                icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
              }
            ].map((section) => (
              <div key={section.title} className="group relative bg-surface-container-high/40 backdrop-blur-md rounded-2xl p-8 border border-white/5 hover:border-primary/40 hover:bg-surface-container-high/60 transition-all duration-500 overflow-hidden hover:-translate-y-1">
                <div className="absolute -right-6 -bottom-6 text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none transform -rotate-12 group-hover:rotate-0 duration-500">
                  <svg className="w-40 h-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={section.icon} />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/30 transition-transform duration-500">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={section.icon} />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{section.title}</h3>
                  <p className="text-white/70 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Full width bottom card */}
          <div className="mt-6 lg:mt-8 max-w-5xl mx-auto animate-fade-in-up delay-300">
            <div className="bg-primary/5 backdrop-blur-md rounded-2xl p-8 sm:p-10 border border-primary/20 text-center relative overflow-hidden group hover:bg-primary/10 transition-all duration-500">
              <div className="relative z-10">
                <h3 className="font-serif text-2xl font-bold text-white mb-4">Meer weten?</h3>
                <p className="text-white/80 leading-relaxed max-w-3xl mx-auto mb-8">
                  Dat ben ik, in grote lijnen. Maar ik heb je nog niet verteld over mijn opleiding Camerajournalistiek,
                  mijn opleiding Digitaal Rechercheur, mijn semester aan de Universiteit in Argentinië of mijn wetenschappelijke publicaties...
                  Neem eens een kijkje op mijn LinkedIn-profiel en stuur me gerust een connectieverzoek!
                </p>
                <Button href="/contact" variant="secondary" className="bg-surface-container-high border-white/10 hover:border-primary/50 text-white shadow-lg">
                  Laten we kennismaken
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional profile */}
      <Section title="Professioneel profiel" subtitle="Mijn academische en professionele achtergrond" bg="bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mt-4">
          {[
            {
              title: "Werkervaring",
              content: "Sinds 2019 werk ik als freelance Virtual Assistant. Hiervoor heb ik gewerkt als content creator op een marketingafdeling, jarenlang als wetenschappelijk DNA-Onderzoeker op een Forensisch Laboratorium en ben ik ondernemer geweest in de culturele sector.",
              icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
            },
            {
              title: "Opleidingen",
              content: "Momenteel studeer ik Rechtsgeleerdheid aan de Open Universiteit. Ik heb tevens een opleiding Juridische Vaardigheden succesvol afgerond. Daarnaast ben ik vroeger geschoold in menselijk skeletonderzoek en humaan DNA-onderzoek.",
              icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
            },
            {
              title: "Talenkennis",
              content: "Nederlands is mijn moedertaal. Daarnaast beheers ik de Engelse taal uitstekend. Gedurende mijn studententijd heb ik enkele jaren Spaans gestudeerd aan de Universiteit Leiden, en tevens in Latijns-Amerika gewoond. Spaanse taal beheers ik dan ook goed.",
              icon: "M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
            },
            {
              title: "Publicaties",
              content: "Als wetenschappelijk DNA-onderzoeker in een forensisch laboratorium heb ik meerdere artikelen gepubliceerd en diverse bijdragen geleverd aan o.a. boeken. Een overzicht van enkele van mijn publicaties is te vinden op mijn LinkedIn-pagina.",
              icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            }
          ].map((profile) => (
            <div key={profile.title} className="group border border-card-border hover:border-primary/50 bg-card p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(200,156,111,0.05)] hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-inner shadow-primary/5">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={profile.icon} />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-on-surface mb-3">{profile.title}</h3>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                {profile.content}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Services detail */}
      <Section
        title="Mijn diensten"
        subtitle="Ik bied drie kernservices aan voor online ondernemers en juridische dienstverleners."
        bg="bg-sidebar"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-4">
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
                "Als Virtual Assistant (VA) is het belangrijk dat je het juridisch fundament van jouw onderneming goed op orde hebt. Dit om aansprakelijkheid, schijnzelfstandigheid, misverstanden en conflicten te voorkomen. Vanuit mijn eigen ervaring als VA bied ik documenten helemaal toegespitst op VA's.",
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
              className="text-center group border border-transparent hover:border-surface-container-high hover:bg-surface-container-low p-6 sm:p-8 rounded-2xl transition-all duration-300"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6 group-hover:scale-110 group-hover:bg-primary/25 transition-transform duration-500 shadow-inner shadow-primary/5">
                <svg
                  className="h-8 w-8 text-primary group-hover:text-primary-dark transition-colors"
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
              <h3 className="font-serif text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl bg-card border border-card-border p-8 sm:p-16 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className="relative z-10 animate-fade-in-up">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface mb-6">
                Klaar om in gesprek te gaan?
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto mb-10">
                Laten we kennismaken! We bespreken jouw behoeften en kijken of we een goede match zijn. Geheel vrijblijvend uiteraard.
              </p>
              <Button href="/contact" size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 transform hover:-translate-y-1 transition-all duration-300">
                Kennismakingsgesprek plannen
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
