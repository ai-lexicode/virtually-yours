import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { createClient } from "@/lib/supabase/server";

// --- Rate limiting (in-memory, per-IP, resets each minute) ---

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

// --- Validation ---

const metricSchema = z.object({
  metric_name: z.enum(["LCP", "INP", "CLS", "FCP", "TTFB"]),
  value: z.number().nonnegative(),
  rating: z.enum(["good", "needs-improvement", "poor"]).optional(),
  page_url: z.string().min(1).max(2048),
  device_type: z.enum(["mobile", "tablet", "desktop"]).optional(),
  connection_speed: z.string().max(50).optional(),
  session_id: z.string().max(128).optional(),
});

const payloadSchema = z.object({
  metrics: z.array(metricSchema).min(1).max(50),
});

// --- Handler ---

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = payloadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("web_vitals").insert(result.data.metrics);

  if (error) {
    console.error("[web-vitals] Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to store metrics" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
