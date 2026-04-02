interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  bg?: string;
  id?: string;
}

export function Section({
  children,
  title,
  subtitle,
  className = "",
  bg = "",
  id,
}: SectionProps) {
  return (
    <section className={`py-16 sm:py-20 ${bg} ${className}`} id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
