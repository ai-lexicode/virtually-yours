"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function WachtwoordVergetenPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      setError("Kon geen reset-link versturen. Probeer het opnieuw.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <>
        <div className="lg:hidden mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Virtually Yours
          </Link>
        </div>

        <div className="text-center">
          <svg
            className="h-12 w-12 text-primary mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          <h1 className="text-2xl font-bold mt-4">Controleer uw e-mail</h1>
          <p className="mt-2 text-sm text-muted">
            Als er een account bestaat voor <strong>{email}</strong>, ontvangt u
            een e-mail met een link om uw wachtwoord te resetten.
          </p>
          <Link
            href="/inloggen"
            className="mt-6 inline-block text-primary hover:text-primary-hover font-medium text-sm"
          >
            Terug naar inloggen
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="lg:hidden mb-8 text-center">
        <Link href="/">
          <Image src="/images/logo.png" alt="Virtually Yours" width={160} height={42} className="h-10 w-auto mx-auto" />
        </Link>
      </div>

      <h1 className="text-2xl font-bold">Wachtwoord vergeten</h1>
      <p className="mt-2 text-sm text-muted">
        Vul uw e-mailadres in en wij sturen u een link om uw wachtwoord te
        resetten.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            E-mailadres
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-card border border-card-border px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary"
            placeholder="uw@email.nl"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 font-semibold text-background hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Bezig..." : "Reset-link versturen"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Weet u uw wachtwoord?{" "}
        <Link
          href="/inloggen"
          className="text-primary hover:text-primary-hover font-medium"
        >
          Inloggen
        </Link>
      </p>
    </>
  );
}
