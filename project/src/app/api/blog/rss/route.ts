import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const db = getPublicClient();
    const { data: posts, error } = await db
      .from("blog_posts")
      .select("title, slug, excerpt, published_at")
      .eq("status", "PUBLISHED")
      .order("published_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://virtually-yours.nl";

    const items = (posts || [])
      .map(
        (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/nieuws/${escapeXml(post.slug)}</link>
      <description>${escapeXml(post.excerpt || "")}</description>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <guid>${baseUrl}/nieuws/${escapeXml(post.slug)}</guid>
    </item>`
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Nieuws — Virtually Yours</title>
    <link>${baseUrl}/nieuws</link>
    <description>Juridisch nieuws en updates voor online ondernemers.</description>
    <language>nl</language>
${items}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("[Blog RSS] GET failed", err);
    return new NextResponse("<error>Internal Server Error</error>", {
      status: 500,
      headers: { "Content-Type": "application/xml" },
    });
  }
}
