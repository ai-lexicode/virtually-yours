"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const faqData: FaqCategory[] = [
  {
    title: "Tarieven en Bestellingen",
    items: [
      {
        question: "Kan ik een spoedopdracht plaatsen?",
        answer:
          "Ja, voor €25 extra. De levertijd is dan 48 uur na het invullen van de vragenlijst. Let op: bij een spoedopdracht is er geen revisieronde. De beschikbaarheid is afhankelijk van de planning.",
      },
      {
        question: "Hoe kan Virtually Yours zo goedkoop zijn?",
        answer:
          "Door te werken met beperkt maatwerk in plaats van volledig maatwerk, focus op één niche (online dienstverleners), vragenlijsten in plaats van telefonisch overleg, en slimme automatisering van processen.",
      },
      {
        question: "Kan ik een offerte aanvragen?",
        answer:
          "Ja, dat kan via het online contactformulier of per e-mail naar info@virtually-yours.nl.",
      },
      {
        question: "Kan ik 50% aanbetalen?",
        answer:
          "Ja, deze optie kunt u selecteren bij het afrekenen. Na ontvangst van de aanbetaling ontvangt u de vragenlijst. De eindfactuur volgt na levering van het document.",
      },
      {
        question: "Ik heb een kortingscode, waar vul ik deze in?",
        answer:
          "U kunt de kortingscode invullen bij het afrekenen. Let op: kortingscodes gelden doorgaans alleen voor documenten en niet voor spoedopdrachten of andere diensten.",
      },
      {
        question: "Bieden jullie ook adviesgesprekken aan?",
        answer:
          "Nee, om de prijzen zo laag mogelijk te houden bieden wij geen adviesgesprekken aan. Heeft u een vraag? Stuur gerust een e-mail — wij helpen u graag verder.",
      },
      {
        question: "Kunnen jullie mijn bestaande documenten controleren?",
        answer:
          "In de meeste gevallen is het voordeliger om documenten opnieuw te laten opstellen. Bij documenten die door derden zijn opgesteld kunnen bovendien auteursrechten spelen.",
      },
      {
        question: "Wat kost volledig maatwerk?",
        answer:
          "Volledig maatwerk begint vanaf €199 en kost gemiddeld €300-400. U kunt een maatwerk-aanvraag doen per e-mail.",
      },
      {
        question: "Kan ik annuleren of retourneren?",
        answer:
          "Nee, dit is helaas niet mogelijk. Alle documenten worden op maat gemaakt en kunnen daarom niet worden geannuleerd of geretourneerd.",
      },
    ],
  },
  {
    title: "Juridische Documenten",
    items: [
      {
        question: "In hoeverre worden de documenten op maat gemaakt?",
        answer:
          "De documenten worden op basis van beperkt maatwerk opgesteld via een vragenlijst. Heeft u specifieke wensen die buiten de standaardvragen vallen? Neem dan contact op voor een maatwerkofferte.",
      },
      {
        question: "Hoe weet ik of de documenten geschikt zijn voor mij?",
        answer:
          "De documenten zijn geschikt als u voldoet aan de volgende criteria: u heeft een eenmanszaak geregistreerd in Nederland, u verleent B2B-diensten aan Nederlandse klanten, u werkt als opdrachtnemer, u biedt voornamelijk online ondersteunende diensten (VA, OBM, SMM, etc.), en u heeft geen bijzondere eisen.",
      },
      {
        question: "Waarom heb ik het Starterspakket nodig?",
        answer:
          "De meeste starters hebben alle documenten uit het pakket nodig. Privacydocumenten zoals de Privacyverklaring en Verwerkersovereenkomst zijn bovendien wettelijk verplicht zodra u persoonsgegevens verwerkt.",
      },
      {
        question: "Hoe zit het met schijnzelfstandigheid?",
        answer:
          "Goed opgestelde documenten zoals de Overeenkomst van Opdracht beperken het risico op schijnzelfstandigheid, maar bieden geen garantie. De feitelijke werkwijze is altijd bepalend. Sinds 1 november 2024 geldt het Wet DBA-kader voor de beoordeling.",
      },
      {
        question: "Mag ik onderhandelen over mijn Algemene Voorwaarden?",
        answer:
          "Dit raden wij af waar mogelijk. De Belastingdienst kijkt onder andere naar wie de voorwaarden heeft opgesteld bij het beoordelen van de arbeidsrelatie.",
      },
      {
        question:
          "Ik verwerk geen persoonsgegevens, heb ik dan toch een Verwerkersovereenkomst nodig?",
        answer:
          "Alleen als u daadwerkelijk geen persoonsgegevens van klanten verwerkt. In de praktijk verwerken de meeste VA's wel degelijk persoonsgegevens — denk aan namen, e-mailadressen of klantgegevens in CRM-systemen.",
      },
      {
        question:
          "Is het wettelijk verplicht om Algemene Voorwaarden of een Overeenkomst van Opdracht te hebben?",
        answer:
          "Nee, er is geen wettelijke verplichting. Maar het is praktisch onmisbaar voor professionele dienstverlening. Zonder deze documenten loopt u onnodige risico's.",
      },
      {
        question: "Ik heb nog geen website, wat nu?",
        answer:
          "U kunt de cookie- en disclaimerdocumenten overslaan totdat u een website heeft. Het Starterspakket blijft desondanks de meest voordelige optie.",
      },
      {
        question: "Hoe weet ik welke cookies mijn website plaatst?",
        answer:
          "Raadpleeg uw websitebouwer of gebruik een tool zoals Cookiebot om de cookies op uw website in kaart te brengen.",
      },
      {
        question: "Hoe vaak moeten documenten worden bijgewerkt?",
        answer:
          "Wij raden aan om uw documenten jaarlijks te laten controleren, of eerder wanneer er relevante wetswijzigingen plaatsvinden.",
      },
    ],
  },
  {
    title: "Samenwerkingen",
    items: [
      {
        question: "Kan ik partner of affiliate worden?",
        answer:
          "Ja, dat is mogelijk! Wij bieden kortingscodes, affiliate-commissies en geïntegreerde samenwerkingen. Neem contact op voor meer informatie.",
      },
      {
        question: "Kan ik bij Virtually Yours werken?",
        answer:
          "Wij werken graag samen met freelance juristen. Neem gerust contact op om de mogelijkheden te bespreken.",
      },
      {
        question: "Kan ik jullie inhuren als Juridisch VA?",
        answer:
          "Nee, Virtually Yours neemt geen nieuwe Juridisch VA-opdrachten meer aan. Wij focussen ons volledig op juridische documenten en het begeleiden van toekomstige Juridisch VA's.",
      },
    ],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 text-primary shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function AccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-card-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 px-1 text-left transition-colors hover:text-primary"
      >
        <span className="text-sm sm:text-base font-medium text-on-surface">
          {item.question}
        </span>
        <ChevronIcon open={open} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="px-1 text-sm leading-relaxed text-muted">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FaqContent() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 text-center bg-sidebar">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-on-surface">
            Veelgestelde vragen
          </h1>
          <p className="mt-6 text-lg text-muted">
            Antwoorden op de meest gestelde vragen over onze juridische
            documenten, tarieven en samenwerkingen.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-14">
          {faqData.map((category) => (
            <div key={category.title}>
              <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                {category.title}
              </h2>
              <div className="rounded-lg bg-card border border-card-border px-5 sm:px-6">
                {category.items.map((item) => (
                  <AccordionItem key={item.question} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-sidebar">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-lg bg-card border border-card-border p-6 sm:p-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
              Vraag niet beantwoord?
            </h2>
            <p className="mt-4 text-muted">
              Neem gerust contact met ons op. We helpen u graag verder.
            </p>
            <a
              href="/contact"
              className="mt-8 inline-block rounded-lg btn-gradient px-8 py-3 font-semibold text-on-primary"
            >
              Contact opnemen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
