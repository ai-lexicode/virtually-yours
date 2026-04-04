import BlogPostEditor from "@/components/admin/BlogPostEditor";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Artikel bewerken</h1>
      <BlogPostEditor postId={id} />
    </div>
  );
}
