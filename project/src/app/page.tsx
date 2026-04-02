import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { DocumentCard } from "@/components/ui/DocumentCard";
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
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Jouw juridische documenten op maat.
            <br />
            <span className="text-primary">Voor online professionals.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted">
            Speciaal voor VA&apos;s, OBM&apos;s, SMM&apos;s en online
            ondernemers in Nederland. Beantwoord een paar vragen en ontvang
            jouw document dezelfde dag.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/documenten"
              className="rounded-lg bg-primary px-8 py-3 text-base font-semibold text-background hover:bg-primary-hover transition-colors"
            >
              Bekijk documenten
            </Link>
            <Link
              href="/hoe-werkt-het"
              className="rounded-lg border border-card-border px-8 py-3 text-base font-semibold text-foreground hover:border-primary/40 transition-colors"
            >
              Hoe werkt het?
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted">
            200+ ondernemers vertrouwen op Virtually Yours
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-card-border bg-card/50 py-6">
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
                <span className="text-sm font-medium text-foreground">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-14">Zo werkt het</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
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
                <span className="text-xs font-bold text-primary">
                  STAP {step.number}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular documents */}
      <section className="py-20 bg-sidebar">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Populaire documenten</h2>
            <Link
              href="/documenten"
              className="text-sm text-primary hover:text-primary-hover transition-colors"
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 p-6 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Klaar om uw juridische zaken te regelen?
            </h2>
            <p className="mt-4 text-muted">
              Bekijk onze documenten en pakketten. Binnen 24 uur uw document op
              maat.
            </p>
            <Link
              href="/documenten"
              className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-background hover:bg-primary-hover transition-colors"
            >
              Bekijk alle documenten
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
