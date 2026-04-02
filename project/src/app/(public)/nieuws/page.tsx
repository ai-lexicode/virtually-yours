import Link from "next/link";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Nieuws — Virtually Yours",
  description: "Juridisch nieuws en updates voor online ondernemers.",
};

const blogPosts = [
  {
    slug: "wet-vbar-schijnzelfstandigheid",
    title: "Wet VBAR en schijnzelfstandigheid",
    date: "25 mei 2024",
    summary:
      "De Wet VBAR (Verduidelijking Beoordeling Arbeidsrelaties en Rechtsvermoeden) brengt belangrijke veranderingen voor zzp'ers en opdrachtgevers. Wat betekent dit voor jou als VA of online ondernemer?",
    category: "Arbeidsrecht",
  },
  {
    slug: "voldoe-jij-aan-de-cookiewet",
    title: "Voldoe jij aan de Cookiewet?",
    date: "25 februari 2024",
    summary:
      "Veel online ondernemers gebruiken cookies op hun website, maar voldoen niet aan de Cookiewet. In dit artikel lees je wat je moet regelen om wel compliant te zijn.",
    category: "Privacy",
  },
  {
    slug: "gevolgen-deliveroo-arrest-voor-vas",
    title: "Gevolgen van het Deliveroo-arrest voor VA's",
    date: "13 december 2023",
    summary:
      "Het Deliveroo-arrest van de Hoge Raad heeft grote gevolgen voor de beoordeling van arbeidsrelaties. Wat betekent deze uitspraak voor virtueel assistenten en hun opdrachtgevers?",
    category: "Arbeidsrecht",
  },
  {
    slug: "overeenkomst-van-opdracht-voor-vas",
    title: "Overeenkomst van Opdracht voor VA's",
    date: "7 december 2023",
    summary:
      "Als VA werk je op basis van een overeenkomst van opdracht. Maar wat moet er precies in staan? En hoe voorkom je dat jouw overeenkomst als arbeidsovereenkomst wordt gezien?",
    category: "Ondernemingsrecht",
  },
];

const categoryColors: Record<string, string> = {
  Arbeidsrecht: "bg-surface-container-high text-primary",
  Privacy: "bg-secondary-container/40 text-secondary",
  Ondernemingsrecht: "bg-surface-container text-primary-container",
};

export default function NieuwsPage() {
  return (
    <>
      <section className="py-16 sm:py-20 text-center bg-surface-container-low">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">Nieuws</h1>
          <p className="mt-4 text-lg text-muted">
            Juridisch nieuws en updates voor online ondernemers, VA&apos;s en
            zzp&apos;ers.
          </p>
        </div>
      </section>

      <Section className="!pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/nieuws/${post.slug}`}
              className="group block rounded-[0.25rem] bg-surface-container-lowest p-6 hover:bg-surface-container-low transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`inline-block rounded-[0.25rem] px-3 py-1 text-xs font-medium font-label ${categoryColors[post.category] || "bg-surface-container text-muted"}`}
                >
                  {post.category}
                </span>
                <span className="text-xs text-muted font-label">{post.date}</span>
              </div>
              <h2 className="font-serif text-lg font-bold group-hover:text-secondary transition-colors text-on-surface">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3">
                {post.summary}
              </p>
              <span className="mt-4 inline-block text-sm text-secondary font-medium group-hover:translate-x-1 transition-transform">
                Lees meer &rarr;
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
