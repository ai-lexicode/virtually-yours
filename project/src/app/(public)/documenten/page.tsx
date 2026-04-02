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
          <h1 className="text-3xl sm:text-4xl font-bold">Juridische Documenten</h1>
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
      </div>
    </section>
  );
}
