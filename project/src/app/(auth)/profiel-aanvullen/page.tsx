"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";

export default function ProfielAanvullenPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [kvkNumber, setKvkNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Sessie verlopen. Log opnieuw in.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        company_name: companyName || null,
        kvk_number: kvkNumber || null,
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

  const handleSkip = () => {
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
        Vul optioneel uw bedrijfsgegevens aan. Dit helpt ons bij het opstellen
        van uw documenten.
      </p>

      {error && (
        <div className="mt-4 rounded-[0.25rem] bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-1 font-label">
            Bedrijfsnaam
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
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
            value={kvkNumber}
            onChange={(e) => setKvkNumber(e.target.value)}
            className="input-field"
            placeholder="12345678"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[0.25rem] btn-gradient py-3 font-semibold text-on-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Bezig..." : "Opslaan"}
        </button>
      </form>

      <p className="mt-6 text-center">
        <button
          type="button"
          onClick={handleSkip}
          className="text-sm text-secondary hover:text-secondary/80 font-medium"
        >
          Overslaan
        </button>
      </p>
    </>
  );
}
