import Link from "next/link";
import { formatPrice } from "@/lib/mollie";

const categoryColors: Record<string, string> = {
  arbeidsrecht: "bg-blue-500/20 text-blue-400",
  ondernemingsrecht: "bg-purple-500/20 text-purple-400",
  privacy: "bg-teal-500/20 text-teal-400",
  commercieel: "bg-amber-500/20 text-amber-400",
  vastgoed: "bg-emerald-500/20 text-emerald-400",
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
      className="group block rounded-xl bg-card border border-card-border p-6 hover:border-primary/40 transition-all"
    >
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${categoryColors[category] || "bg-gray-500/20 text-gray-400"}`}
      >
        {categoryLabels[category] || category}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted line-clamp-2">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-primary">
          {priceCents === 0 ? "Gratis" : formatPrice(priceCents)}
        </span>
        <span className="text-sm text-primary-muted group-hover:text-primary transition-colors">
          Bekijken &rarr;
        </span>
      </div>
    </Link>
  );
}
