"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

type CartItem = {
  id: string;
  title: string;
  slug: string;
  priceCents: number;
  type: "document" | "bundle";
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function calculateBtw(priceCents: number): number {
  return Math.round(priceCents - priceCents / (1 + 21 / 100));
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <section className="py-12">
          <div className="mx-auto max-w-2xl px-4 text-center text-muted">
            Laden...
          </div>
        </section>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const docSlug = searchParams.get("doc");
  const bundleSlug = searchParams.get("bundle");

  const [item, setItem] = useState<CartItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function load() {
      // Check auth
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email ?? "" });
      }

      // Load document or bundle
      if (docSlug) {
        const { data } = await supabase
          .from("documents")
          .select("id, title, slug, price_cents")
          .eq("slug", docSlug)
          .single();
        if (data) {
          setItem({
            id: data.id,
            title: data.title,
            slug: data.slug,
            priceCents: data.price_cents,
            type: "document",
          });
        }
      } else if (bundleSlug) {
        const { data } = await supabase
          .from("bundles")
          .select("id, title, slug, price_cents")
          .eq("slug", bundleSlug)
          .single();
        if (data) {
          setItem({
            id: data.id,
            title: data.title,
            slug: data.slug,
            priceCents: data.price_cents,
            type: "bundle",
          });
        }
      }

      setLoading(false);
    }

    load();
  }, [docSlug, bundleSlug]);

  const handleCheckout = async () => {
    if (!item) return;

    if (!user) {
      window.location.href = `/inloggen?redirect=/checkout?doc=${docSlug || ""}&bundle=${bundleSlug || ""}`;
      return;
    }

    setPaying(true);
    setError("");

    try {
      // Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              documentId: item.type === "document" ? item.id : undefined,
              bundleId: item.type === "bundle" ? item.id : undefined,
            },
          ],
        }),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        throw new Error(data.error || "Bestelling aanmaken mislukt");
      }

      const { orderId } = await orderRes.json();

      // Create Mollie payment
      const paymentRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!paymentRes.ok) {
        const data = await paymentRes.json();
        throw new Error(data.error || "Betaling starten mislukt");
      }

      const { checkoutUrl } = await paymentRes.json();
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is een fout opgetreden");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4 text-center text-muted">
          Laden...
        </div>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-2xl font-bold">Geen product gevonden</h1>
          <p className="text-muted mt-2">
            Het geselecteerde document of pakket is niet beschikbaar.
          </p>
          <Link
            href="/documenten"
            className="mt-6 inline-block text-primary hover:text-primary-hover"
          >
            &larr; Terug naar documenten
          </Link>
        </div>
      </section>
    );
  }

  const btw = calculateBtw(item.priceCents);
  const subtotal = item.priceCents - btw;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link href="/documenten" className="hover:text-foreground">
            Documenten
          </Link>{" "}
          &gt; Afrekenen
        </p>

        <h1 className="text-3xl font-bold mb-8">Afrekenen</h1>

        {/* Order summary */}
        <div className="bg-card border border-card-border rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Uw bestelling</h2>

          <div className="flex items-center justify-between py-3 border-b border-card-border">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted mt-0.5">
                {item.type === "bundle" ? "Pakket" : "Document"}
              </p>
            </div>
            <span className="font-medium">{formatPrice(item.priceCents)}</span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-muted">
              <span>Subtotaal (excl. BTW)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>BTW (21%)</span>
              <span>{formatPrice(btw)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-card-border">
              <span>Totaal</span>
              <span className="text-primary">{formatPrice(item.priceCents)}</span>
            </div>
          </div>
        </div>

        {/* Payment info */}
        <div className="bg-card border border-card-border rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Betaling</h2>
          <p className="text-sm text-muted">
            Na het klikken op &quot;Betalen&quot; wordt u doorgestuurd naar Mollie
            om veilig te betalen via iDEAL, creditcard, Bancontact of Klarna.
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4">
            {["iDEAL", "Visa", "Mastercard", "Klarna"].map((method) => (
              <span
                key={method}
                className="text-xs bg-card-border/50 px-3 py-1.5 rounded-md text-muted"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Login notice */}
        {!user && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6">
            <div className="flex gap-3">
              <svg
                className="h-5 w-5 text-primary shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-primary">
                  Account vereist
                </p>
                <p className="text-xs text-muted mt-1">
                  U wordt doorgestuurd om in te loggen of een account aan te
                  maken voordat u kunt betalen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Pay button */}
        <button
          onClick={handleCheckout}
          disabled={paying}
          className="w-full bg-primary hover:bg-primary-hover text-background font-semibold py-4 rounded-xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paying ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Bezig met verwerken...
            </span>
          ) : (
            `Betalen — ${formatPrice(item.priceCents)}`
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Veilig betalen via Mollie — SSL beveiligd
        </div>

        <p className="text-center text-xs text-muted mt-4">
          Door te betalen gaat u akkoord met onze{" "}
          <Link href="/algemene-voorwaarden" className="text-primary hover:text-primary-hover">
            algemene voorwaarden
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
