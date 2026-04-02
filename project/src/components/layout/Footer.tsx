import Link from "next/link";
import Image from "next/image";
import { CookiePreferencesButton } from "@/components/public/CookiePreferencesButton";

const documentLinks = [
  { href: "/documenten?cat=privacy", label: "Privacyverklaring" },
  { href: "/documenten?cat=verwerking", label: "Verwerkersovereenkomst" },
  { href: "/documenten?cat=voorwaarden", label: "Algemene Voorwaarden" },
  { href: "/documenten", label: "Alle documenten" },
];

const infoLinks = [
  { href: "/over-mij", label: "Over mij" },
  { href: "/hoe-werkt-het", label: "Hoe werkt het" },
  { href: "/juridisch-va", label: "Juridisch VA" },
  { href: "/nieuws", label: "Nieuws" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-sidebar text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/images/logo-monogram.png"
                alt="VY"
                width={36}
                height={36}
                className="h-9 w-9"
              />
              <span className="font-serif text-xl font-bold text-primary">Risha Smeding</span>
            </div>
            <p className="mt-2 text-sm text-white/50">
              Freelance jurist, Legal Engineer &amp; Juridisch VA
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.facebook.com/virtuallyyoursnl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-white/50 hover:text-primary hover:bg-surface-container-high transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/rishasmeding/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-white/50 hover:text-primary hover:bg-surface-container-high transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/virtually_yours_nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-white/50 hover:text-primary hover:bg-surface-container-high transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-label text-primary mb-4">
              Documenten
            </h3>
            <ul className="space-y-2">
              {documentLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-label text-primary mb-4">
              Informatie
            </h3>
            <ul className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-label text-primary mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-white/50">
              <li>Wikkestraat 68</li>
              <li>Alphen aan den Rijn</li>
              <li className="text-xs text-white/30">Werkdagen: Ma, Di, Vr</li>
              <li className="pt-1">
                <a href="tel:+31618755103" className="hover:text-primary transition-colors">
                  +31 (0)6 18755103
                </a>
              </li>
              <li>
                <a href="mailto:info@virtually-yours.nl" className="hover:text-primary transition-colors">
                  info@virtually-yours.nl
                </a>
              </li>
              <li className="pt-1">KvK: 76053881</li>
              <li>BTW: NL003038893B59</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-card-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Virtually Yours. Alle rechten
            voorbehouden.
          </p>
          <div className="flex gap-4 text-xs text-white/30">
            <Link href="/privacyverklaring" className="hover:text-primary transition-colors">
              Privacyverklaring
            </Link>
            <Link href="/privacyverklaring" className="hover:text-primary transition-colors">
              Cookiebeleid
            </Link>
            <Link href="/algemene-voorwaarden" className="hover:text-primary transition-colors">
              Algemene Voorwaarden
            </Link>
            <CookiePreferencesButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
