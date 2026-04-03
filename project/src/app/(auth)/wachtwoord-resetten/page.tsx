"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function WachtwoordResettenPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  const supabaseRef = useRef(
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  const supabase = supabaseRef.current;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
          setSessionReady(true);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }
    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens bevatten");
      return;
    }

    setLoading(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      console.error("[reset-password] updateUser failed:", updateError.message);
      setError("Kon wachtwoord niet bijwerken. Probeer het opnieuw.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <>
      <div className="lg:hidden mb-8 text-center">
        <Link href="/">
          <Image src="/images/logo-full.png" alt="Virtually Yours" width={240} height={60} className="h-12 w-auto mx-auto" priority />
        </Link>
      </div>

      <h1 className="text-2xl font-bold">Nieuw wachtwoord</h1>
      <p className="mt-2 text-sm text-muted">
        Kies een nieuw wachtwoord voor uw account.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Nieuw wachtwoord
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-card border border-card-border px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary"
            placeholder="Minimaal 8 tekens"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            Bevestig wachtwoord
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg bg-card border border-card-border px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary"
            placeholder="Herhaal wachtwoord"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !sessionReady}
          className="w-full rounded-lg bg-primary py-3 font-semibold text-background hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!sessionReady
            ? "Sessie laden..."
            : loading
              ? "Bezig..."
              : "Wachtwoord opslaan"}
        </button>
      </form>
    </>
  );
}
