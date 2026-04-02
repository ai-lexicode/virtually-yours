import Link from "next/link";
import { formatPrice } from "@/lib/mollie";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Pakketten — Virtually Yours",
  description: "Bespaar tot 20% met onze documentpakketten.",
};

export default async function PakkettenPage() {
  const supabase = await createClient();
  const { data: rawBundles } = await supabase
    .from("bundles")
    .select("*, bundle_items(documents(title, price_cents))")
    .eq("is_active", true)
    .order("price_cents");

  const bundles = (rawBundles || []).map((b) => {
    const items = (b.bundle_items as { documents: { title: string; price_cents: number } }[]) || [];
    const originalCents = items.reduce((sum, i) => sum + i.documents.price_cents, 0);
    return {
      title: b.title,
      slug: b.slug,
      description: b.description,
      priceCents: b.price_cents,
      originalCents,
      discount: Math.round(b.discount_percentage),
      popular: b.slug === "starterspakket",
      includes: items.map((i) => ({
        title: i.documents.title,
        price: formatPrice(i.documents.price_cents),
      })),
    };
  });
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">Pakketten</h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            Bespaar tot 20% met onze documentpakketten — alles wat u nodig heeft
            in een keer geregeld.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {bundles.map((bundle) => (
            <div
              key={bundle.title}
              className={`rounded-[0.25rem] bg-surface-container-lowest p-6 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
                bundle.popular
                  ? "ring-2 ring-secondary"
                  : ""
              }`}
            >
              {bundle.popular && (
                <span className="self-center -mt-9 rounded-[0.25rem] bg-secondary px-4 py-1 text-xs font-bold text-on-secondary">
                  Meest gekozen
                </span>
              )}
              <h3
                className={`font-serif text-xl font-bold text-on-surface ${bundle.popular ? "mt-3" : ""}`}
              >
                {bundle.title}
              </h3>
              <p className="text-sm text-muted mt-1">{bundle.description}</p>

              <div className="mt-6">
                <span className="text-3xl font-bold text-secondary">
                  {formatPrice(bundle.priceCents)}
                </span>
                <span className="ml-2 text-sm text-muted line-through">
                  {formatPrice(bundle.originalCents)}
                </span>
                <span className="ml-2 inline-block rounded-[0.25rem] bg-success/20 px-2 py-0.5 text-xs font-medium text-success">
                  Bespaar {bundle.discount}%
                </span>
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {bundle.includes.map((item) => (
                  <li key={item.title} className="flex items-start gap-2">
                    <svg
                      className="h-5 w-5 text-secondary mt-0.5 shrink-0"
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
                    <span className="text-sm text-muted">
                      {item.title}
                      {item.price && (
                        <span className="text-xs text-muted/60 ml-1">
                          ({item.price})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout?bundle=${bundle.title.toLowerCase().replace(/ /g, "-")}`}
                className={`mt-6 block w-full rounded-[0.25rem] py-3 text-center font-semibold transition-colors ${
                  bundle.popular
                    ? "btn-gradient text-on-primary"
                    : "bg-surface-container-lowest text-secondary hover:bg-surface-container-low"
                }`}
              >
                Bestellen
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-sm text-muted">
          Liever een individueel document?{" "}
          <Link
            href="/documenten"
            className="text-secondary hover:text-secondary/80 font-medium"
          >
            Bekijk alle documenten &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
