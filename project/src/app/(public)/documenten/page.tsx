import { DocumentCard } from "@/components/ui/DocumentCard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Juridische Documenten — Virtually Yours",
  description: "Bekijk ons aanbod van juridische documenten op maat voor VA's, OBM's, SMM's en online professionals.",
};

export default async function DocumentenPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("title, slug, description, category, price_cents")
    .eq("is_active", true)
    .eq("has_docassemble", true)
    .order("sort_order");
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm text-muted mb-2">Home &gt; Documenten</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">Juridische Documenten</h1>
          <p className="mt-3 text-muted">
            Kies het document dat past bij jouw situatie als online professional.
          </p>
          <p className="mt-1 text-sm text-muted">
            {documents?.length || 0} documenten gevonden
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents?.map((doc) => (
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

        {/* Quickscan Gratis CTA */}
        <div className="mt-16 rounded-2xl bg-surface-container border border-primary/20 p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 justify-between hover:border-primary/40 transition-colors">
          <div className="flex-1">
            <span className="inline-block rounded-full bg-success/20 px-3 py-1 text-xs font-bold text-success mb-3 uppercase tracking-wider">
              Gratis Service
            </span>
            <h2 className="font-serif text-2xl font-bold text-on-surface mb-2">
              Quickscan Documenten
            </h2>
            <p className="text-muted leading-relaxed max-w-2xl">
              Heb je al algemene voorwaarden of een privacyverklaring, maar weet je niet zeker of deze (nog) voldoen aan de huidige wetgeving?
              Vraag een gratis en vrijblijvende Quickscan aan. Ik loop globaal door je documenten heen en laat je weten of er aanpassingen nodig zijn.
            </p>
          </div>
          <div className="w-full md:w-auto shrink-0 flex items-center justify-center">
            <a 
              href="/contact"
              className="inline-block px-8 py-4 w-full md:w-auto rounded-lg btn-gradient text-on-primary font-bold shadow-lg text-center transition-transform hover:scale-105"
            >
              Vraag Quickscan aan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
