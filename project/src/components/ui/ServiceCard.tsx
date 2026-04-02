import Link from "next/link";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  href?: string;
}

export function ServiceCard({ icon, title, description, href }: ServiceCardProps) {
  const content = (
    <div className="rounded-[0.25rem] bg-surface-container-lowest p-6 hover:bg-surface-container-low transition-all group h-full shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-[0.25rem] bg-surface-container mb-4">
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
      <h3 className="font-serif text-lg font-bold group-hover:text-secondary transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
      {href && (
        <span className="mt-4 inline-block text-sm text-secondary font-medium group-hover:translate-x-1 transition-transform">
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
