import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";

const blogImages: Record<string, string> = {
  "wet-vbar-schijnzelfstandigheid": "/images/blog/blog-wetboeken.jpg",
  "voldoe-jij-aan-de-cookiewet": "/images/blog/blog-cookiewet.jpg",
  "gevolgen-deliveroo-arrest-voor-vas": "/images/blog/blog-deliveroo.jpg",
  "overeenkomst-van-opdracht-voor-vas": "/images/blog/blog-contract.jpg",
};

const blogPosts: Record<
  string,
  { title: string; date: string; category: string; summary: string }
> = {
  "wet-vbar-schijnzelfstandigheid": {
    title: "Wet VBAR en schijnzelfstandigheid",
    date: "25 mei 2024",
    category: "Arbeidsrecht",
    summary:
      "De Wet VBAR (Verduidelijking Beoordeling Arbeidsrelaties en Rechtsvermoeden) brengt belangrijke veranderingen voor zzp'ers en opdrachtgevers. De wet introduceert een rechtsvermoeden van een arbeidsovereenkomst wanneer het uurtarief onder een bepaald bedrag ligt. Dit heeft directe gevolgen voor VA's, OBM's en andere online professionals die als zzp'er werken.",
  },
  "voldoe-jij-aan-de-cookiewet": {
    title: "Voldoe jij aan de Cookiewet?",
    date: "25 februari 2024",
    category: "Privacy",
    summary:
      "Veel online ondernemers gebruiken cookies op hun website, maar voldoen niet aan de Cookiewet. De Telecommunicatiewet schrijft voor dat je vooraf toestemming moet vragen voor het plaatsen van tracking cookies. In dit artikel lees je wat je moet regelen om wel compliant te zijn en hoe je een correct cookiebeleid opstelt.",
  },
  "gevolgen-deliveroo-arrest-voor-vas": {
    title: "Gevolgen van het Deliveroo-arrest voor VA's",
    date: "13 december 2023",
    category: "Arbeidsrecht",
    summary:
      "Het Deliveroo-arrest van de Hoge Raad heeft grote gevolgen voor de beoordeling van arbeidsrelaties in Nederland. De Hoge Raad heeft verduidelijkt welke factoren meewegen bij het onderscheid tussen een arbeidsovereenkomst en een overeenkomst van opdracht. Voor VA's en hun opdrachtgevers is het belangrijk om te begrijpen wat dit arrest betekent voor hun werkrelatie.",
  },
  "overeenkomst-van-opdracht-voor-vas": {
    title: "Overeenkomst van Opdracht voor VA's",
    date: "7 december 2023",
    category: "Ondernemingsrecht",
    summary:
      "Als VA werk je op basis van een overeenkomst van opdracht (artikel 7:400 BW). Maar wat moet er precies in staan? Een goede overeenkomst van opdracht beschermt zowel jou als je opdrachtgever en voorkomt dat de relatie als arbeidsovereenkomst kan worden aangemerkt. In dit artikel bespreken we de essentiële elementen.",
  },
};

const categoryColors: Record<string, string> = {
  Arbeidsrecht: "bg-surface-container-high text-primary",
  Privacy: "bg-secondary-container/40 text-secondary",
  Ondernemingsrecht: "bg-surface-container text-primary-container",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug];
  if (!post) return { title: "Artikel niet gevonden — Virtually Yours" };
  return {
    title: `${post.title} — Virtually Yours`,
    description: post.summary.slice(0, 160),
  };
}

export default async function NieuwsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug];
  if (!post) notFound();

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
          <span
            className={`inline-block rounded-[0.25rem] px-3 py-1 text-xs font-medium font-label ${categoryColors[post.category] || "bg-surface-container text-muted"}`}
          >
            {post.category}
          </span>
          <span className="text-sm text-muted font-label">{post.date}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">{post.title}</h1>

        {blogImages[slug] && (
          <div className="relative w-full h-64 mt-6 rounded-lg overflow-hidden">
            <Image
              src={blogImages[slug]}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-8 text-muted leading-relaxed space-y-4">
          <p>{post.summary}</p>
        </div>

        <div className="mt-10 rounded-[0.25rem] bg-surface-container-low p-6 text-center">
          <p className="text-sm text-muted mb-4">
            Lees het volledige artikel op onze blog.
          </p>
          <Button
            href={`https://virtually-yours.nl/blog/${slug}`}
            variant="primary"
          >
            Lees het volledige artikel
          </Button>
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
