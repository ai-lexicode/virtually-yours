"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";

export default function ProfielAanvullenPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Pre-fill name from OAuth metadata if available
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const meta = user.user_metadata;
      setFirstName(meta?.given_name || meta?.first_name || meta?.full_name?.split(" ")[0] || "");
      setLastName(
        meta?.family_name ||
        meta?.last_name ||
        meta?.full_name?.split(" ").slice(1).join(" ") ||
        ""
      );
    }
    loadProfile();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("Voornaam en achternaam zijn verplicht");
      return;
    }

    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Sessie verlopen. Log opnieuw in.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      setError("Opslaan mislukt. Probeer het opnieuw.");
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
          <Image
            src="/images/logo-full.png"
            alt="Virtually Yours"
            width={240}
            height={60}
            className="h-12 w-auto mx-auto"
            priority
          />
        </Link>
      </div>

      <h1 className="font-serif text-2xl font-bold text-on-surface">
        Welkom bij Virtually Yours!
      </h1>
      <p className="mt-2 text-sm text-muted">
        Vul uw gegevens aan om uw account compleet te maken.
      </p>

      {error && (
        <div className="mt-4 rounded-[0.25rem] bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="mt-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1 font-label">
              Voornaam *
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input-field"
              placeholder="Achternaam"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[0.25rem] btn-gradient py-3 font-semibold text-on-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Bezig..." : "Opslaan"}
        </button>
      </form>
    </>
  );
}
