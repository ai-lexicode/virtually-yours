"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success-pending" | "success-subscribed" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(
          data.error === "INVALID_EMAIL"
            ? "Voer een geldig e-mailadres in."
            : "Er ging iets mis. Probeer het later opnieuw."
        );
        setStatus("error");
        return;
      }

      const data = await res.json();
      setStatus(data.pending ? "success-pending" : "success-subscribed");
      setEmail("");
    } catch {
      setErrorMsg("Er ging iets mis. Probeer het later opnieuw.");
      setStatus("error");
    }
  };

  if (status === "success-pending") {
    return (
      <p className="text-sm text-primary">
        Controleer uw e-mail voor bevestiging.
      </p>
    );
  }

  if (status === "success-subscribed") {
    return (
      <p className="text-sm text-primary">
        U bent aangemeld voor de newsletter!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Uw e-mailadres"
        required
        className="flex-1 min-w-0 rounded-lg bg-surface-container px-3 py-2 text-sm text-white placeholder:text-white/30 border border-card-border focus:border-primary focus:outline-none transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {status === "loading" ? "..." : "Aanmelden"}
      </button>
      {status === "error" && (
        <p className="absolute mt-12 text-xs text-red-400">{errorMsg}</p>
      )}
    </form>
  );
}
