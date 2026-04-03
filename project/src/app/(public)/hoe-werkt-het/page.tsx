import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Document of pakket kiezen",
    description: "Kies het document of startpakket dat het beste past bij jouw bedrijf. Twijfel je? Vraag gerust een Gratis Quickscan aan of boek een juridisch adviesgesprek in.",
  },
  {
    number: "02",
    title: "Online Vragenlijst",
    description: "Direct na de betaling ontvang je een link naar een dynamische online vragenlijst. Hierin beantwoord je gerichte vragen over jouw specifieke situatie en wensen, zodat we maatwerk kunnen leveren.",
  },
  {
    number: "03",
    title: "Conceptversie",
    description: "Binnen 5 werkdagen na ontvangst van je ingevulde vragenlijst stellen we het document op maat voor je op en sturen we je de conceptversie per e-mail (tenzij je hebt gekozen voor een spoedaanvraag binnen 48 uur).",
  },
  {
    number: "04",
    title: "Revisieronde",
    description: "Je hebt de mogelijkheid om de conceptversie rustig door te nemen. Tijdens één revisieronde kun je vragen stellen of nog kleine aanpassingen doorgeven, zodat alles perfect aansluit op jouw werkwijze.",
  },
  {
    number: "05",
    title: "Definitieve Versie",
    description: "Na het verwerken van eventuele feedback ontvang je de definitieve, juridisch sluitende versie van je documenten, klaar voor direct gebruik in je bedrijf!",
  },
];

const comparison = [
  { traditional: "Advocaat inschakelen (€ 500+)", vy: "Vanaf € 39" },
  { traditional: "Weken wachten", vy: "Binnen 24 uur" },
  { traditional: "Standaard templates", vy: "Volledig op maat" },
  { traditional: "Geen ondersteuning achteraf", vy: "3 maanden nazorg" },
  {
    traditional: "Onduidelijke kosten",
    vy: "Vaste, transparante prijzen",
  },
];

export const metadata = {
  title: "Hoe werkt het — Virtually Yours",
  description:
    "Van bestelling tot document op maat in 4 eenvoudige stappen. Geen juridische kennis nodig.",
};

export default function HoeWerktHetPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 text-center bg-sidebar">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-on-surface">
            Hoe werkt Virtually Yours?
          </h1>
          <p className="mt-6 text-lg text-muted">
            Van bestelling tot document op maat — in 4 eenvoudige stappen. Geen
            juridische kennis nodig.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-20">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col md:flex-row items-center gap-10 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <span className="text-3xl sm:text-5xl font-bold font-serif text-primary/30">
                  {step.number}
                </span>
                <h2 className="mt-2 font-serif text-2xl font-bold text-on-surface">{step.title}</h2>
                <p className="mt-4 text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-48 w-full max-w-sm rounded-lg bg-card border border-card-border flex items-center justify-center">
                  <span className="text-4xl sm:text-6xl font-bold font-serif text-primary/20">
                    {step.number}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-sidebar">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-center mb-10 text-on-surface">
            Waarom Virtually Yours?
          </h2>
          <div className="rounded-lg bg-card border border-card-border overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-surface-container-high">
              <div className="p-4 text-sm font-semibold text-muted">
                Traditioneel
              </div>
              <div className="p-4 text-sm font-semibold text-primary">
                Met Virtually Yours
              </div>
            </div>
            {comparison.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 sm:grid-cols-2 ${i > 0 ? "border-t border-card-border" : ""}`}
              >
                <div className="p-4 text-sm text-muted flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-error shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {row.traditional}
                </div>
                <div className="p-4 text-sm text-on-surface flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-primary shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {row.vy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-lg bg-card border border-card-border p-6 sm:p-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">Klaar om te beginnen?</h2>
            <p className="mt-4 text-muted">
              Bekijk onze documenten en ontvang uw document op maat binnen 24
              uur.
            </p>
            <Link
              href="/documenten"
              className="mt-8 inline-block rounded-lg btn-gradient px-8 py-3 font-semibold text-on-primary"
            >
              Bekijk documenten
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
