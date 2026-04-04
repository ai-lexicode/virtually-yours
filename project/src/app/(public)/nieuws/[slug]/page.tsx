import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";

const categoryColors: Record<string, string> = {
  arbeidsrecht: "bg-surface-container-high text-primary",
  privacy: "bg-secondary-container/40 text-secondary",
  ondernemingsrecht: "bg-primary-dark/20 text-primary",
};

function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getPublicClient();
  const { data: post } = await db
    .from("blog_posts")
    .select("title, meta_title, meta_description, excerpt")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .single();

  if (!post) return { title: "Artikel niet gevonden — Virtually Yours" };

  return {
    title: post.meta_title || `${post.title} — Virtually Yours`,
    description: post.meta_description || (post.excerpt || "").slice(0, 160),
  };
}

export default async function NieuwsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getPublicClient();
  const { data: post } = await db
    .from("blog_posts")
    .select("*, blog_categories(name, slug)")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .single();

  if (!post) notFound();

  const categorySlug = post.blog_categories?.slug || "";
  const colorClass = categoryColors[categorySlug] || "bg-surface-container text-muted";

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link href="/nieuws" className="hover:text-secondary transition-colors">
            Nieuws
          </Link>{" "}
          &gt; {post.title}
        </p>

        <div className="flex items-center gap-3 mb-4">
          {post.blog_categories?.name && (
            <span
              className={`inline-block rounded-[0.25rem] px-3 py-1 text-xs font-medium font-label ${colorClass}`}
            >
              {post.blog_categories.name}
            </span>
          )}
          {formattedDate && (
            <span className="text-sm text-muted font-label">{formattedDate}</span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">
          {post.title}
        </h1>

        {post.cover_image && (
          <div className="relative w-full h-64 mt-6 rounded-lg overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-8 text-muted leading-relaxed prose prose-invert max-w-none prose-headings:font-serif prose-headings:text-on-surface prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3 prose-p:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:my-1 prose-a:text-secondary prose-a:underline hover:prose-a:text-secondary/80 prose-strong:text-on-surface">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-10 pt-6">
          <Link
            href="/nieuws"
            className="text-sm text-secondary hover:text-secondary/80 font-medium"
          >
            &larr; Terug naar alle artikelen
          </Link>
        </div>
      </article>
    </section>
  );
}
