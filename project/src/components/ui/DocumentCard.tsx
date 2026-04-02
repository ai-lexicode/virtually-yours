import Link from "next/link";
import { formatPrice } from "@/lib/mollie";

const categoryColors: Record<string, string> = {
  arbeidsrecht: "bg-surface-container-high text-primary",
  ondernemingsrecht: "bg-surface-container text-primary-container",
  privacy: "bg-secondary-container/40 text-secondary",
  commercieel: "bg-accent/30 text-secondary",
  vastgoed: "bg-surface-container-low text-secondary",
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
      className="group block rounded-[0.25rem] bg-surface-container-lowest p-6 hover:bg-surface-container-low transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <span
        className={`inline-block rounded-[0.25rem] px-3 py-1 text-xs font-medium font-label ${categoryColors[category] || "bg-surface-container text-muted"}`}
      >
        {categoryLabels[category] || category}
      </span>
      <h3 className="mt-4 font-serif text-lg font-bold text-on-surface group-hover:text-secondary transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted line-clamp-2">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-secondary">
          {priceCents === 0 ? "Gratis" : formatPrice(priceCents)}
        </span>
        <span className="text-sm text-secondary/70 group-hover:text-secondary transition-colors">
          Bekijken &rarr;
        </span>
      </div>
    </Link>
  );
}
