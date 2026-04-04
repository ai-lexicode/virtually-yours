import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function NewsletterBevestigdPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const isExpired = status === "expired";

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {isExpired ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-4">
              Link verlopen
            </h1>
            <p className="text-white/60 mb-8">
              Deze bevestigingslink is niet meer geldig. Meld u opnieuw aan voor
              de newsletter om een nieuwe link te ontvangen.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-4">
              Uw aanmelding is bevestigd!
            </h1>
            <p className="text-white/60 mb-8">
              Bedankt voor uw aanmelding. U ontvangt voortaan onze nieuwsbrief
              met juridische tips en updates.
            </p>
          </>
        )}
        <Link
          href="/"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Terug naar de homepage
        </Link>
      </div>
    </section>
  );
}
