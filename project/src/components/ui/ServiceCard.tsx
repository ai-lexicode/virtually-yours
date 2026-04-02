import Link from "next/link";
import Image from "next/image";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  href?: string;
  image?: string;
  imageAlt?: string;
}

export function ServiceCard({ icon, title, description, href, image, imageAlt }: ServiceCardProps) {
  const content = (
    <div className="rounded-lg bg-surface-light p-6 hover:shadow-lg transition-all group h-full border-l-3 border-primary">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
        {image ? (
          <Image src={image} alt={imageAlt || title} width={64} height={64} className="h-8 w-8 object-contain" />
        ) : (
          <svg
            className="h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        )}
      </div>
      <h3 className="font-serif text-lg font-bold text-on-primary group-hover:text-primary-dark transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-on-primary/70 leading-relaxed">{description}</p>
      {href && (
        <span className="mt-4 inline-block text-sm text-primary-dark font-medium group-hover:translate-x-1 transition-transform">
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
