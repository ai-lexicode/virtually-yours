"use client";

import { useEffect, useState } from "react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { saveConsent, getConsent, type ConsentState } from "@/hooks/useConsentTracking";

/* ---------- cross-tab sync ---------- */
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("consent-updated", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("consent-updated", cb);
  };
}

let cached: ConsentState | null = null;
function snap(): ConsentState | null {
  const next = getConsent();
  if (JSON.stringify(next) !== JSON.stringify(cached)) cached = next;
  return cached;
}
function serverSnap(): ConsentState | null {
  return null;
}

/* ---------- component ---------- */
export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, snap, serverSnap);
  const [visible, setVisible] = useState(false);
  const [panel, setPanel] = useState(false);
  const [analyticsToggle, setAnalyticsToggle] = useState(false);

  // Show banner if no consent yet
  useEffect(() => {
    if (!consent) {
      // Avoid synchronous setState in effect warning by deferring slightly
      const timer = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(timer);
    }
  }, [consent]);

  // Listen for footer button to re-open
  useEffect(() => {
    const handler = () => {
      setVisible(true);
      setPanel(false);
      // Pre-fill toggle with current preference
      const current = getConsent();
      setAnalyticsToggle(current?.analytics ?? false);
    };
    window.addEventListener("open-cookie-preferences", handler);
    return () => window.removeEventListener("open-cookie-preferences", handler);
  }, []);

  function handleAcceptAll() {
    saveConsent(true);
    setVisible(false);
    setPanel(false);
  }

  function handleRejectNonEssential() {
    saveConsent(false);
    setVisible(false);
    setPanel(false);
  }

  function handleOpenPanel() {
    const current = getConsent();
    setAnalyticsToggle(current?.analytics ?? false);
    setPanel(true);
  }

  function handleSavePreferences() {
    saveConsent(analyticsToggle);
    setVisible(false);
    setPanel(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto max-w-3xl rounded-xl border border-outline-gold bg-surface-container-low p-6 shadow-2xl">
        {!panel ? (
          /* ---------- Banner ---------- */
          <>
            <p className="text-sm text-white leading-relaxed mb-1">
              Wij gebruiken cookies om onze website te verbeteren. Essentiële cookies zijn noodzakelijk
              voor de werking van de site. Analytische cookies helpen ons het gebruik te begrijpen.
            </p>
            <p className="text-xs text-muted mb-5">
              Lees meer in onze{" "}
              <a href="/privacyverklaring" className="underline hover:text-primary transition-colors">
                privacyverklaring
              </a>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="sm" onClick={handleAcceptAll} className="flex-1">
                Alles accepteren
              </Button>
              <Button variant="secondary" size="sm" onClick={handleRejectNonEssential} className="flex-1">
                Niet-essentieel weigeren
              </Button>
              <Button variant="secondary" size="sm" onClick={handleOpenPanel} className="flex-1">
                Personaliseren
              </Button>
            </div>
          </>
        ) : (
          /* ---------- Personalization panel ---------- */
          <>
            <h3 className="text-base font-semibold text-white mb-4">Cookie-voorkeuren</h3>

            {/* Essential — always on */}
            <div className="flex items-center justify-between py-3 border-b border-card-border">
              <div>
                <p className="text-sm font-medium text-white">Essentieel</p>
                <p className="text-xs text-muted">Noodzakelijk voor de werking van de website.</p>
              </div>
              <div
                className="relative h-6 w-11 rounded-full bg-primary cursor-not-allowed opacity-70"
                title="Altijd actief"
              >
                <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
              </div>
            </div>

            {/* Analytics — toggleable */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-white">Analytisch</p>
                <p className="text-xs text-muted">Helpt ons het gebruik van de website te begrijpen.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={analyticsToggle}
                onClick={() => setAnalyticsToggle(!analyticsToggle)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  analyticsToggle ? "bg-primary" : "bg-outline-variant"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    analyticsToggle ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <Button variant="primary" size="sm" onClick={handleSavePreferences} className="flex-1">
                Voorkeuren opslaan
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setPanel(false)} className="flex-1">
                Terug
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
