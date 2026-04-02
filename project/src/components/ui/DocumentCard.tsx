import Link from "next/link";
import { formatPrice } from "@/lib/mollie";

const categoryColors: Record<string, string> = {
  arbeidsrecht: "bg-primary/15 text-primary-hover",
  ondernemingsrecht: "bg-primary-dark/20 text-primary",
  privacy: "bg-primary/20 text-primary",
  commercieel: "bg-accent/20 text-accent",
  vastgoed: "bg-accent/15 text-accent",
};

const categoryLabels: Record<string, string> = {
  arbeidsrecht: "Arbeidsrecht",
  ondernemingsrecht: "Ondernemingsrecht",
  privacy: "Privacy & AVG",
  commercieel: "Commercieel",
  vastgoed: "Vastgoed",
};

interface DocumentCardProps {
  title: string;
  slug: string;
  description: string;
  category: string;
  priceCents: number;
}

export function DocumentCard({
  title,
  slug,
  description,
  category,
  priceCents,
}: DocumentCardProps) {
  return (
    <Link
      href={`/documenten/${slug}`}
      className="group block rounded-lg bg-card p-6 hover:border-primary/40 transition-all border border-card-border"
    >
      <span
        className={`inline-block rounded-lg px-3 py-1 text-xs font-medium font-label ${categoryColors[category] || "bg-surface-container-high text-muted"}`}
      >
        {categoryLabels[category] || category}
      </span>
      <h3 className="mt-4 font-serif text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted line-clamp-2">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-primary">
          {priceCents === 0 ? "Gratis" : formatPrice(priceCents)}
        </span>
        <span className="text-sm text-primary/70 group-hover:text-primary transition-colors">
          Bekijken &rarr;
        </span>
      </div>
    </Link>
  );
}
