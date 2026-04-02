"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useConsentTracking } from "@/hooks/useConsentTracking";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function GoogleTagManager() {
  const { analyticsConsented } = useConsentTracking();

  // Push default consent state (denied) on mount
  useEffect(() => {
    if (!GTM_ID) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "consent_default",
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }, []);

  // Push consent update when user grants/revokes analytics
  useEffect(() => {
    if (!GTM_ID) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "consent_update",
      analytics_storage: analyticsConsented ? "granted" : "denied",
    });
  }, [analyticsConsented]);

  if (!GTM_ID || !analyticsConsented) return null;

  return (
    <Script
      id="gtm-script"
      strategy="lazyOnload"
      src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
      onLoad={() => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      }}
    />
  );
}
