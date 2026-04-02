import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { DocumentCard } from "@/components/ui/DocumentCard";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

const steps = [
  {
    number: "01",
    title: "Kies",
    description: "Selecteer het document dat past bij uw situatie",
    icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  },
  {
    number: "02",
    title: "Betaal",
    description: "Betaal veilig via iDEAL, creditcard of Klarna",
    icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
  },
  {
    number: "03",
    title: "Beantwoord",
    description: "Vul de slimme vragenlijst in — gemiddeld 10 minuten",
    icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z",
  },
  {
    number: "04",
    title: "Ontvang",
    description: "Download uw document op maat als PDF of Word",
    icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3",
  },
];

const trustItems = [
  "KvK Geregistreerd",
  "AVG Compliant",
  "Opgesteld door juristen",
  "Levering binnen 24 uur",
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: popularDocs } = await supabase
    .from("documents")
    .select("title, slug, description, category, price_cents")
    .eq("is_active", true)
    .order("sort_order")
    .limit(6);

  return (
    <>
      <Navbar />
      {/* Hero — dark with gold accents */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 bg-background" style={{ backgroundImage: "url('/images/hero-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-label text-primary tracking-wide mb-4">
            Freelance Juridisch VA
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
            JOUW JURIDISCHE DOCUMENTEN
            <br />
            <span className="text-primary">OP MAAT</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted leading-relaxed">
            Speciaal voor VA&apos;s, OBM&apos;s, SMM&apos;s en online
            ondernemers in Nederland. Beantwoord een paar vragen en ontvang
            jouw document dezelfde dag.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/documenten" size="lg">
              Bekijk documenten
            </Button>
            <Button href="/hoe-werkt-het" variant="secondary" size="lg">
              Hoe werkt het?
            </Button>
          </div>
          <p className="mt-8 text-sm text-muted/60">
            200+ ondernemers vertrouwen op Virtually Yours
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-surface-container-low py-6 border-y border-card-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                <span className="text-sm font-medium text-on-surface">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <Section
        title="Wat kan ik voor je betekenen?"
        subtitle="Ik help online ondernemers met juridische documenten, VA-ondersteuning en coaching."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            icon="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
            title="Juridisch VA"
            description="Ik werk doorgaans remote en ondersteun juridische dienstverleners, zoals adviesbureaus en advocatenkantoren, met diverse juridische werkzaamheden."
            href="/over-mij"
            image="/images/icons/icon-legal-va.png"
            imageAlt="Juridisch VA"
          />
          <ServiceCard
            icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            title="Juridische Documenten"
            description="Juridische documenten op maat voor online professionals. Van algemene voorwaarden tot verwerkersovereenkomsten, specifiek afgestemd op jouw situatie."
            href="/documenten"
            image="/images/icons/icon-documents.png"
            imageAlt="Documenten"
          />
          <ServiceCard
            icon="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
            title="Coaching VAs"
            description="Ik begeleid startende juridische VA's bij het opzetten van hun praktijk. Van het vinden van klanten tot het opbouwen van een sterk juridisch fundament."
            href="/contact"
            image="/images/icons/icon-coaching.png"
            imageAlt="Coaching"
          />
        </div>
      </Section>

      {/* How it works */}
      <Section
        title="Zo werkt het"
        bg="bg-sidebar"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15 mb-4">
                <svg
                  className="h-7 w-7 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={step.icon}
                  />
                </svg>
              </div>
              <span className="text-label text-primary">
                STAP {step.number}
              </span>
              <h3 className="mt-2 font-serif text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Popular documents */}
      <Section
        title="Populaire documenten"
      >
        <div className="flex justify-end mb-6 -mt-8">
          <Link
            href="/documenten"
            className="text-sm text-primary hover:text-primary-hover transition-colors font-medium"
          >
            Alle documenten &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDocs?.map((doc) => (
            <DocumentCard
              key={doc.slug}
              title={doc.title}
              slug={doc.slug}
              description={doc.description}
              category={doc.category}
              priceCents={doc.price_cents}
            />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-lg bg-card border border-card-border p-6 sm:p-12 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
              Klaar om uw juridische zaken te regelen?
            </h2>
            <p className="mt-4 text-muted">
              Bekijk onze documenten en pakketten. Binnen 24 uur uw document op
              maat.
            </p>
            <div className="mt-8">
              <Button href="/documenten" size="lg">
                Bekijk alle documenten
              </Button>
            </div>
          </div>
        </div>
      </Section>
      <Footer />
    </>
  );
}
