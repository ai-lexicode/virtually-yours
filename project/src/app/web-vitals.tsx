"use client";

import { useEffect, useRef, useCallback } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

const BATCH_DELAY_MS = 2_000;
const MAX_RETRIES = 3;
const API_URL = "/api/analytics/web-vitals";

interface MetricPayload {
  metric_name: string;
  value: number;
  rating?: string;
  page_url: string;
  device_type?: string;
  connection_speed?: string;
  session_id?: string;
}

function getDeviceType(): string {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getConnectionSpeed(): string | undefined {
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string };
  };
  return nav.connection?.effectiveType;
}

function getSessionId(): string {
  const key = "vy-vitals-session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function WebVitals() {
  const queueRef = useRef<MetricPayload[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async (metrics: MetricPayload[], attempt = 0) => {
    if (metrics.length === 0) return;

    const body = JSON.stringify({ metrics });

    // Use sendBeacon for unload, fetch otherwise
    if (typeof navigator.sendBeacon === "function" && document.visibilityState === "hidden") {
      navigator.sendBeacon(API_URL, new Blob([body], { type: "application/json" }));
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
      if (!res.ok && attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 1_000;
        setTimeout(() => flush(metrics, attempt + 1), delay);
      }
    } catch {
      if (attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 1_000;
        setTimeout(() => flush(metrics, attempt + 1), delay);
      }
    }
  }, []);

  const scheduleFlush = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const batch = queueRef.current.splice(0);
      flush(batch);
    }, BATCH_DELAY_MS);
  }, [flush]);

  const handleMetric = useCallback(
    (metric: Metric) => {
      const payload: MetricPayload = {
        metric_name: metric.name,
        value: metric.value,
        rating: metric.rating,
        page_url: window.location.pathname,
        device_type: getDeviceType(),
        connection_speed: getConnectionSpeed(),
        session_id: getSessionId(),
      };
      queueRef.current.push(payload);
      scheduleFlush();
    },
    [scheduleFlush]
  );

  useEffect(() => {
    onCLS(handleMetric);
    onFCP(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);

    // Flush remaining metrics on page hide
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const batch = queueRef.current.splice(0);
        flush(batch);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current);
      const remaining = queueRef.current.splice(0);
      flush(remaining);
    };
  }, [handleMetric, flush]);

  return null;
}
