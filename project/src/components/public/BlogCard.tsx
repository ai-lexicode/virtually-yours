import Link from "next/link";
import Image from "next/image";

const categoryColors: Record<string, string> = {
  arbeidsrecht: "bg-surface-container-high text-primary",
  privacy: "bg-secondary-container/40 text-secondary",
  ondernemingsrecht: "bg-primary-dark/20 text-primary",
};

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  category_name: string | null;
  category_slug: string | null;
}

export function BlogCard({
  title,
  slug,
  excerpt,
  cover_image,
  published_at,
  category_name,
  category_slug,
}: BlogCardProps) {
  const colorClass =
    (category_slug && categoryColors[category_slug]) ||
    "bg-surface-container text-muted";

  const formattedDate = published_at
    ? new Date(published_at).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/nieuws/${slug}`}
      className="group block rounded-[0.25rem] bg-surface-container-lowest overflow-hidden hover:bg-surface-container-low transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      {cover_image && (
        <div className="relative w-full h-40">
          <Image src={cover_image} alt={title} fill className="object-cover" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          {category_name && (
            <span
              className={`inline-block rounded-[0.25rem] px-3 py-1 text-xs font-medium font-label ${colorClass}`}
            >
              {category_name}
            </span>
          )}
          {formattedDate && (
            <span className="text-xs text-muted font-label">{formattedDate}</span>
          )}
        </div>
        <h2 className="font-serif text-lg font-bold group-hover:text-secondary transition-colors text-on-surface">
          {title}
        </h2>
        {excerpt && (
          <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}
        <span className="mt-4 inline-block text-sm text-secondary font-medium group-hover:translate-x-1 transition-transform">
          Lees meer &rarr;
        </span>
      </div>
    </Link>
  );
}
