"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
export default function RegistrerenPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    kvkNumber: "",
    email: "",
    password: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.terms) {
      setError("U moet akkoord gaan met de algemene voorwaarden");
      return;
    }
    if (form.password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens bevatten");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        companyName: form.companyName || undefined,
        kvkNumber: form.kvkNumber || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registratie mislukt. Probeer het opnieuw.");
      setLoading(false);
      return;
    }

    // Email confirmation is required — show success message
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <>
        <div className="lg:hidden mb-8 text-center">
          <Link href="/" className="font-serif text-2xl font-bold text-primary">
            Virtually Yours
          </Link>
        </div>

        <div className="text-center">
          <svg
            className="h-12 w-12 text-success mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="font-serif text-2xl font-bold mt-4 text-on-surface">Account aangemaakt!</h1>
          <p className="mt-2 text-sm text-muted">
            We hebben een bevestigingslink gestuurd naar{" "}
            <strong>{form.email}</strong>. Klik op de link om uw account te
            activeren.
          </p>
          <Link
            href="/inloggen"
            className="mt-6 inline-block text-secondary hover:text-secondary/80 font-medium text-sm"
          >
            Naar inloggen
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="lg:hidden mb-8 text-center">
        <Link href="/">
          <Image src="/images/logo-full.png" alt="Virtually Yours" width={240} height={60} className="h-12 w-auto mx-auto" priority />
        </Link>
      </div>

      <h1 className="font-serif text-2xl font-bold text-on-surface">Account aanmaken</h1>
      <p className="mt-2 text-sm text-muted">
        Maak een gratis account aan om te beginnen
      </p>

      <div className="mt-8">
        <SocialAuthButtons />
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-surface px-4 text-muted">of</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-[0.25rem] bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1 font-label">
              Voornaam *
            </label>
            <input
              type="text"
              required
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className="input-field"
              placeholder="Voornaam"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1 font-label">
              Achternaam *
            </label>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className="input-field"
              placeholder="Achternaam"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1 font-label">
            Bedrijfsnaam
          </label>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className="input-field"
            placeholder="Uw bedrijfsnaam"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1 font-label">
            KvK-nummer
          </label>
          <input
            type="text"
            value={form.kvkNumber}
            onChange={(e) => update("kvkNumber", e.target.value)}
            className="input-field"
            placeholder="12345678"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1 font-label">
            E-mailadres *
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="input-field"
            placeholder="uw@email.nl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1 font-label">
            Wachtwoord *
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="input-field"
            placeholder="Minimaal 8 tekens"
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => update("terms", e.target.checked)}
            className="h-5 w-5 rounded-[0.25rem] mt-0.5 accent-secondary"
          />
          <span>
            Ik ga akkoord met de{" "}
            <Link href="/algemene-voorwaarden" className="text-secondary">
              algemene voorwaarden
            </Link>{" "}
            en het{" "}
            <Link href="/privacyverklaring" className="text-secondary">
              privacybeleid
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[0.25rem] btn-gradient py-3 font-semibold text-on-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Bezig..." : "Registreren"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Al een account?{" "}
        <Link
          href="/inloggen"
          className="text-secondary hover:text-secondary/80 font-medium"
        >
          Inloggen
        </Link>
      </p>
    </>
  );
}
