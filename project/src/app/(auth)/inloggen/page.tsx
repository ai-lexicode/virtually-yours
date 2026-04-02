"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";

export default function InloggenPage() {
  return (
    <Suspense fallback={<div className="text-center text-muted">Laden...</div>}>
      <InloggenContent />
    </Suspense>
  );
}

function InloggenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "/dashboard";
  const safeRedirect = redirectParam.startsWith("/") && !redirectParam.startsWith("//") ? redirectParam : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmailNotConfirmed(false);
    setResendSent(false);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message === "Email not confirmed") {
        setEmailNotConfirmed(true);
      } else {
        setError("Ongeldige e-mail of wachtwoord");
      }
      setLoading(false);
      return;
    }

    // Check if user is admin and redirect to admin portal
    const roleRes = await fetch("/api/profile/role");
    if (roleRes.ok) {
      const { role } = await roleRes.json();
      if (role === "admin") {
        router.push("/admin");
        router.refresh();
        return;
      }
    }

    router.push(safeRedirect);
    router.refresh();
  };

  const handleResendConfirmation = async () => {
    setLoading(true);
    await fetch("/api/auth/resend-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setResendSent(true);
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("Vul uw e-mailadres in");
      return;
    }
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}${safeRedirect}`,
      },
    });

    if (authError) {
      setError("Kon geen magic link versturen. Probeer het opnieuw.");
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  };

  if (magicLinkSent) {
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
            We hebben een inloglink gestuurd naar <strong>{email}</strong>.
            Klik op de link in de e-mail om in te loggen.
          </p>
          <button
            onClick={() => setMagicLinkSent(false)}
            className="mt-6 text-sm text-primary hover:text-primary-hover"
          >
            Andere methode gebruiken
          </button>
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

      <h1 className="text-2xl font-bold">Welkom terug</h1>
      <p className="mt-2 text-sm text-muted">
        Log in op uw Virtually Yours portaal
      </p>

      {emailNotConfirmed && (
        <div className="mt-4 rounded-lg bg-primary/10 border border-primary/30 px-4 py-3 text-sm text-foreground">
          <p className="font-medium">Account nog niet geactiveerd</p>
          <p className="mt-1 text-muted">
            Controleer uw e-mail en klik op de bevestigingslink om uw account te activeren.
            Controleer ook uw spam-map.
          </p>
          {resendSent ? (
            <p className="mt-2 text-primary font-medium">
              Bevestigingsmail opnieuw verzonden!
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendConfirmation}
              disabled={loading}
              className="mt-2 text-primary hover:text-primary-hover font-medium disabled:opacity-50"
            >
              Bevestigingsmail opnieuw versturen
            </button>
          )}
        </div>
      )}

      {error && !emailNotConfirmed && (
        <div className="mt-4 rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Wachtwoord
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-card border border-card-border px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-end text-sm">
          <Link href="/wachtwoord-vergeten" className="text-primary hover:text-primary-hover">
            Wachtwoord vergeten?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 font-semibold text-background hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Bezig..." : "Inloggen"}
        </button>
      </form>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-card-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-4 text-muted">of</span>
        </div>
      </div>

      <button
        onClick={handleMagicLink}
        disabled={loading}
        className="mt-6 w-full rounded-lg border border-card-border py-3 text-sm font-medium text-foreground hover:border-primary/40 transition-colors disabled:opacity-50"
      >
        Inloggen met magic link
      </button>

      <p className="mt-8 text-center text-sm text-muted">
        Nog geen account?{" "}
        <Link
          href="/registreren"
          className="text-primary hover:text-primary-hover font-medium"
        >
          Registreer gratis
        </Link>
      </p>
    </>
  );
}
