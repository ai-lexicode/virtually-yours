import Link from "next/link";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  href?: string;
}

export function ServiceCard({ icon, title, description, href }: ServiceCardProps) {
  const content = (
    <div className="rounded-xl bg-card border border-card-border p-6 hover:border-primary/40 transition-all group h-full">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
        <svg
          className="h-6 w-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
      {href && (
        <span className="mt-4 inline-block text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
          Meer informatie &rarr;
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
