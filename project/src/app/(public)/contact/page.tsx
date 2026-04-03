"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    subject: "Algemene vraag",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setError("Kon bericht niet versturen. Probeer het opnieuw.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4 text-center" aria-live="polite">
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
          <h1 className="font-serif text-2xl font-bold mt-4 text-on-surface">Bericht verstuurd!</h1>
          <p className="mt-2 text-muted">
            Bedankt voor uw bericht. Wij reageren binnen 24 uur op werkdagen.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">Contact</h1>
          <p className="mt-4 text-lg text-muted">
            Heeft u vragen? Neem gerust contact met mij op.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Form — light card for contrast */}
          <div className="rounded-lg bg-surface-light p-6">
            <h2 className="font-serif text-xl font-bold mb-6 text-on-primary">
              Stuur een bericht
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-error/10 px-4 py-3 text-sm text-error" aria-live="polite">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-on-primary/70 mb-1 font-label">
                  Naam *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="input-field"
                  placeholder="Uw naam"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-on-primary/70 mb-1 font-label">
                  E-mailadres *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="input-field"
                  placeholder="uw@email.nl"
                />
              </div>
              <div>
                <label htmlFor="contact-company" className="block text-sm font-medium text-on-primary/70 mb-1 font-label">
                  Bedrijfsnaam
                </label>
                <input
                  id="contact-company"
                  type="text"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  className="input-field"
                  placeholder="Optioneel"
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-on-primary/70 mb-1 font-label">
                  Onderwerp *
                </label>
                <select
                  id="contact-subject"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  className="input-field"
                >
                  <option>Algemene vraag</option>
                  <option>Vraag over een document</option>
                  <option>Hulp bij vragenlijst</option>
                  <option>Coaching</option>
                  <option>Samenwerking</option>
                  <option>Anders</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-on-primary/70 mb-1 font-label">
                  Bericht *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="input-field resize-none"
                  placeholder="Uw bericht..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg btn-gradient py-3 font-semibold text-on-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Bezig..." : "Versturen"}
              </button>
              <p className="text-xs text-on-primary/50 text-center">
                Ik reageer binnen 24 uur op werkdagen.
              </p>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            {[
              {
                icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                title: "Adres",
                value: "Wikkestraat 68",
                sub: "Alphen aan den Rijn (geen bezoekadres)",
              },
              {
                icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Werkdagen",
                value: "Maandag, dinsdag, vrijdag",
                sub: "Andere dagen in overleg",
              },
              {
                icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
                title: "Telefoon",
                value: "+31 (0)6 18755103",
                sub: "(bellen alleen op afspraak)",
              },
              {
                icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
                title: "E-mail",
                value: "info@virtually-yours.nl",
              },
              {
                icon: "M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
                title: "WhatsApp",
                value: "+31 (0)6 18755103",
                sub: "Stuur gerust een berichtje!",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg bg-card p-5 flex items-start gap-4 border border-card-border"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 shrink-0">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.icon}
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-on-surface">{item.title}</h3>
                  <p className="text-sm text-muted">{item.value}</p>
                  {item.sub && (
                    <p className="text-xs text-muted/60">{item.sub}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Decorative image */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-card-border">
              <Image
                src="/images/risha-justitia.jpg"
                alt="Risha met Lady Justice"
                fill
                className="object-cover"
              />
            </div>

            {/* Company details */}
            <div className="rounded-lg bg-card p-5 mt-4 border border-card-border">
              <h3 className="font-semibold text-sm mb-3 text-on-surface">
                Bedrijfsgegevens
              </h3>
              <div className="space-y-1 text-sm text-muted">
                <p className="font-medium text-on-surface">
                  Virtually Yours
                </p>
                <p>Wikkestraat 68, Alphen aan den Rijn</p>
                <p>KvK: 76053881</p>
                <p>BTW: NL003038893B59</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
