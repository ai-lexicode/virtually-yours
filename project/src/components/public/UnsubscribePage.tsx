"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UnsubscribePageProps {
  token: string;
}

type Status = "loading" | "active" | "inactive" | "unsubscribed" | "error";

export function UnsubscribePage({ token }: UnsubscribePageProps) {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    fetch(`/api/newsletter/unsubscribe/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("NOT_FOUND");
        return res.json();
      })
      .then((data) => {
        const isActive = data.is_active ?? data.isActive;
        setStatus(isActive ? "active" : "inactive");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  const handleUnsubscribe = async () => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/newsletter/unsubscribe/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("FAILED");
      setStatus("unsubscribed");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <p className="text-white/60">Laden...</p>
        )}

        {status === "active" && (
          <>
            <h1 className="text-2xl font-bold text-white mb-4">
              Uitschrijven
            </h1>
            <p className="text-white/60 mb-8">
              Wilt u zich uitschrijven van de Virtually Yours newsletter?
            </p>
            <button
              onClick={handleUnsubscribe}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Uitschrijven
            </button>
          </>
        )}

        {status === "inactive" && (
          <>
            <h1 className="text-2xl font-bold text-white mb-4">
              Reeds uitgeschreven
            </h1>
            <p className="text-white/60 mb-8">
              U bent al uitgeschreven van de newsletter.
            </p>
          </>
        )}

        {status === "unsubscribed" && (
          <>
            <h1 className="text-2xl font-bold text-white mb-4">
              Uitgeschreven
            </h1>
            <p className="text-white/60 mb-8">
              U bent succesvol uitgeschreven van de newsletter. U ontvangt geen
              e-mails meer van ons.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-white mb-4">
              Er ging iets mis
            </h1>
            <p className="text-white/60 mb-8">
              Deze link is ongeldig of verlopen. Neem contact op als u zich wilt
              uitschrijven.
            </p>
          </>
        )}

        <div className="mt-6">
          <Link
            href="/"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Terug naar de homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
