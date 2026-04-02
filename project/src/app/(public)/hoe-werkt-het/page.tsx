import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Kies uw document",
    description:
      "Blader door onze catalogus of kies een compleet pakket. Elk document bevat een duidelijke omschrijving van wat erin staat en voor wie het geschikt is. Twijfelt u? Neem gerust contact op — wij helpen u graag bij de juiste keuze.",
  },
  {
    number: "02",
    title: "Betaal veilig online",
    description:
      "Betaal eenvoudig via iDEAL, creditcard of Klarna. Uw betaling wordt verwerkt door Mollie — de meest gebruikte betaalprovider van Nederland. Na betaling krijgt u direct toegang tot uw persoonlijke portaal.",
  },
  {
    number: "03",
    title: "Vul de vragenlijst in",
    description:
      "In uw persoonlijke portaal vindt u een slimme vragenlijst die is afgestemd op het gekozen document. Beantwoord de vragen over uw bedrijf en situatie — dit duurt gemiddeld 10-15 minuten. U kunt tussentijds opslaan en later verdergaan.",
  },
  {
    number: "04",
    title: "Ontvang uw document",
    description:
      "Eenvoudige documenten ontvangt u direct. Complexere documenten worden eerst gecontroleerd door onze jurist en zijn binnen 24 uur beschikbaar. Download uw document als PDF of Word vanuit uw portaal. Inclusief 3 maanden gratis nazorg.",
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
      <section className="py-20 text-center bg-surface-container-low">
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
                <span className="text-3xl sm:text-5xl font-bold font-serif text-secondary/30">
                  {step.number}
                </span>
                <h2 className="mt-2 font-serif text-2xl font-bold text-on-surface">{step.title}</h2>
                <p className="mt-4 text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-48 w-full max-w-sm rounded-[0.25rem] bg-surface-container-low flex items-center justify-center">
                  <span className="text-4xl sm:text-6xl font-bold font-serif text-secondary/20">
                    {step.number}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-surface-container-low">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-center mb-10 text-on-surface">
            Waarom Virtually Yours?
          </h2>
          <div className="rounded-[0.25rem] bg-surface-container-lowest overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-surface-container">
              <div className="p-4 text-sm font-semibold text-muted">
                Traditioneel
              </div>
              <div className="p-4 text-sm font-semibold text-secondary">
                Met Virtually Yours
              </div>
            </div>
            {comparison.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 sm:grid-cols-2 ${i > 0 ? "bg-surface-container-low/30" : ""}`}
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
                    className="h-4 w-4 text-secondary shrink-0"
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
          <div className="rounded-[0.25rem] bg-gradient-to-r from-primary to-primary-container p-6 sm:p-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-primary">Klaar om te beginnen?</h2>
            <p className="mt-4 text-on-primary/70">
              Bekijk onze documenten en ontvang uw document op maat binnen 24
              uur.
            </p>
            <Link
              href="/documenten"
              className="mt-8 inline-block rounded-[0.25rem] bg-surface-container-lowest px-8 py-3 font-semibold text-secondary hover:bg-surface-container-low transition-colors"
            >
              Bekijk documenten
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
