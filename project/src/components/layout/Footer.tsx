import Link from "next/link";

const documentLinks = [
  { href: "/documenten?cat=privacy", label: "Privacyverklaring" },
  { href: "/documenten?cat=verwerking", label: "Verwerkersovereenkomst" },
  { href: "/documenten?cat=voorwaarden", label: "Algemene Voorwaarden" },
  { href: "/documenten", label: "Alle documenten" },
];

const infoLinks = [
  { href: "/hoe-werkt-het", label: "Hoe werkt het" },
  { href: "/pakketten", label: "Pakketten" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-sidebar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold text-primary">Virtually Yours</span>
            <p className="mt-3 text-sm text-muted">
              Jouw juridische documenten op maat. Voor online professionals,
              VA&apos;s, OBM&apos;s en SMM&apos;s.
            </p>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Documenten
            </h3>
            <ul className="space-y-2">
              {documentLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Informatie
            </h3>
            <ul className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>info@virtually-yours.nl</li>
              <li>+31 (0)6 18755103</li>
              <li>KvK: 76053881</li>
              <li>BTW: NL003038893B59</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-card-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Virtually Yours. Alle
            rechten voorbehouden.
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <Link href="/algemene-voorwaarden" className="hover:text-foreground">
              Algemene Voorwaarden
            </Link>
            <Link href="/privacyverklaring" className="hover:text-foreground">
              Privacyverklaring
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
