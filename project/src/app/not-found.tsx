import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-2">Pagina niet gevonden</h2>
        <p className="text-muted mb-8">
          De pagina die u zoekt bestaat niet of is verplaatst.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Terug naar home
        </Link>
      </div>
    </div>
  );
}
