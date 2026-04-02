"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/over-mij", label: "Over mij" },
  { href: "/documenten", label: "Documenten" },
  { href: "/pakketten", label: "Pakketten" },
  { href: "/nieuws", label: "Nieuws" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Virtually Yours"
              width={140}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/inloggen"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Inloggen
            </Link>
            <Link
              href="/registreren"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary-hover transition-colors"
            >
              Gratis account
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile slide panel */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-background border-l border-card-border shadow-xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-card-border">
            <span className="text-lg font-bold text-primary">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-muted hover:text-foreground"
              aria-label="Sluiten"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-3 text-sm text-muted hover:text-foreground hover:bg-card transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-card-border space-y-2">
              <Link
                href="/inloggen"
                className="block rounded-lg px-3 py-3 text-sm text-muted hover:text-foreground hover:bg-card transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Inloggen
              </Link>
              <Link
                href="/registreren"
                className="block rounded-lg bg-primary px-3 py-3 text-sm font-medium text-background text-center hover:bg-primary-hover transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Gratis account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
