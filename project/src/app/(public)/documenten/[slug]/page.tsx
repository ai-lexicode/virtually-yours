import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

const categoryLabels: Record<string, string> = {
  arbeidsrecht: "Arbeidsrecht",
  ondernemingsrecht: "Ondernemingsrecht",
  privacy: "Privacy & AVG",
  commercieel: "Commercieel",
  vastgoed: "Vastgoed",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("title, description")
    .eq("slug", slug)
    .single();
  if (!doc) return { title: "Document niet gevonden — Virtually Yours" };
  return {
    title: `${doc.title} — Virtually Yours`,
    description: doc.description,
  };
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!doc) notFound();

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link href="/documenten" className="hover:text-primary transition-colors">
            Documenten
          </Link>{" "}
          &gt; {doc.title}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left column */}
          <div className="lg:col-span-3">
            <span className="inline-block rounded-lg bg-primary/15 px-3 py-1 text-xs font-medium font-label text-primary">
              {categoryLabels[doc.category] || doc.category}
            </span>
            <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-on-surface">
              {doc.title}
            </h1>
            <p className="mt-4 text-lg text-muted">{doc.long_description || doc.description}</p>

            {/* Includes */}
            <div className="mt-10">
              <h2 className="font-serif text-xl font-bold mb-4 text-on-surface">
                Wat is inbegrepen
              </h2>
              <ul className="space-y-3">
                {(doc.includes as string[]).map((item: string) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 text-primary mt-0.5 shrink-0"
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
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div className="mt-10">
              <h2 className="font-serif text-xl font-bold mb-4 text-on-surface">Het proces</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  ["1", "Bestellen & betalen", "Kies dit document en betaal veilig online"],
                  ["2", "Vragenlijst invullen", `Beantwoord vragen over uw situatie (±${doc.estimated_time_minutes} min)`],
                  ["3", "Document ontvangen", doc.requires_review ? "Ontvang uw gecontroleerd document binnen 24 uur" : "Ontvang uw document direct na het invullen"],
                ].map(([num, title, desc]) => (
                  <div
                    key={num}
                    className="rounded-lg bg-card border border-card-border p-4"
                  >
                    <span className="text-label text-primary">
                      STAP {num}
                    </span>
                    <h3 className="mt-1 font-semibold text-sm text-on-surface">{title}</h3>
                    <p className="mt-1 text-xs text-muted">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — pricing card */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 rounded-lg bg-card border border-card-border p-6">
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(doc.price_cents)}
                </span>
                <p className="text-sm text-muted mt-1">incl. 21% BTW</p>
              </div>

              <ul className="space-y-2 mb-6">
                {[
                  "Op maat gemaakt",
                  "Juridisch getoetst",
                  doc.requires_review
                    ? "Levering binnen 24 uur"
                    : "Directe levering",
                  "PDF + Word formaat",
                  "3 maanden nazorg",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted"
                  >
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
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout?doc=${slug}`}
                className="block w-full rounded-lg btn-gradient py-3 text-center font-semibold text-on-primary"
              >
                Bestellen
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Veilig betalen via Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
