"use client";

import { useSyncExternalStore } from "react";

const CONSENT_KEY = "vy-cookie-consent";
const LOG_KEY = "vy-consent-log";

export interface ConsentState {
  essential: true;
  analytics: boolean;
  timestamp: string;
}

function getSnapshot(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): ConsentState | null {
  return null;
}

let cachedSnapshot: ConsentState | null = null;

function subscribe(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("consent-updated", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("consent-updated", handler);
  };
}

function stableGetSnapshot(): ConsentState | null {
  const next = getSnapshot();
  if (JSON.stringify(next) !== JSON.stringify(cachedSnapshot)) {
    cachedSnapshot = next;
  }
  return cachedSnapshot;
}

export function useConsentTracking() {
  const consent = useSyncExternalStore(subscribe, stableGetSnapshot, getServerSnapshot);
  return {
    analyticsConsented: consent?.analytics ?? false,
  };
}

export function saveConsent(analytics: boolean): void {
  const state: ConsentState = {
    essential: true,
    analytics,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state));

  // Audit trail
  const log = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  log.push({ action: analytics ? "granted" : "denied", ...state });
  localStorage.setItem(LOG_KEY, JSON.stringify(log));

  window.dispatchEvent(new Event("consent-updated"));
}

export function getConsent(): ConsentState | null {
  return getSnapshot();
}
