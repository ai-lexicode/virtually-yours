import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { Section } from "@/components/ui/Section";
import { BlogCard } from "@/components/public/BlogCard";
import { BlogPagination } from "@/components/public/BlogPagination";

export const metadata = {
  title: "Nieuws — Virtually Yours",
  description: "Juridisch nieuws en updates voor online ondernemers.",
};

const POSTS_PER_PAGE = 12;

function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  blog_categories: { name: string; slug: string } | null;
}

export default async function NieuwsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const categoryFilter = params.category || "";
  const offset = (page - 1) * POSTS_PER_PAGE;

  const db = getPublicClient();

  // Fetch categories for filter
  const { data: categories } = await db
    .from("blog_categories")
    .select("name, slug")
    .order("name");

  // Fetch posts
  let query = db
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image, published_at, blog_categories(name, slug)", {
      count: "exact",
    })
    .eq("status", "PUBLISHED");

  if (categoryFilter) {
    // Get category id first
    const { data: cat } = await db
      .from("blog_categories")
      .select("id")
      .eq("slug", categoryFilter)
      .single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  const { data: posts, count } = await query
    .order("published_at", { ascending: false })
    .range(offset, offset + POSTS_PER_PAGE - 1);

  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);

  return (
    <>
      <section className="py-16 sm:py-20 text-center bg-surface-container-low">
        <div className="mx-auto max-w-5xl px-4">
          <Image
            src="/images/blog/blog-header.png"
            alt="Nieuws"
            width={1200}
            height={400}
            className="w-full h-64 object-cover rounded-lg mb-8"
            priority
          />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">
            Nieuws
          </h1>
          <p className="mt-4 text-lg text-muted">
            Juridisch nieuws en updates voor online ondernemers, VA&apos;s en
            zzp&apos;ers.
          </p>
        </div>
      </section>

      <Section className="!pt-0">
        {/* Category filter */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 max-w-5xl mx-auto mb-8">
            <a
              href="/nieuws"
              className={`rounded-[0.25rem] px-3 py-1.5 text-sm font-medium transition-colors ${
                !categoryFilter
                  ? "bg-primary text-white"
                  : "bg-surface-container-lowest text-muted hover:text-on-surface"
              }`}
            >
              Alles
            </a>
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={`/nieuws?category=${cat.slug}`}
                className={`rounded-[0.25rem] px-3 py-1.5 text-sm font-medium transition-colors ${
                  categoryFilter === cat.slug
                    ? "bg-primary text-white"
                    : "bg-surface-container-lowest text-muted hover:text-on-surface"
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {(posts as BlogPost[] || []).map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              cover_image={post.cover_image}
              published_at={post.published_at}
              category_name={post.blog_categories?.name || null}
              category_slug={post.blog_categories?.slug || null}
            />
          ))}
        </div>

        {(!posts || posts.length === 0) && (
          <p className="text-center text-muted mt-8">Geen artikelen gevonden.</p>
        )}

        <BlogPagination page={page} totalPages={totalPages} baseUrl="/nieuws" />
      </Section>
    </>
  );
}
