"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-error mb-4">500</h1>
        <h2 className="text-xl font-semibold mb-2">Er ging iets mis</h2>
        <p className="text-muted mb-8">
          Er is een onverwachte fout opgetreden. Probeer het opnieuw.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Opnieuw proberen
        </button>
      </div>
    </div>
  );
}
