import BlogPostEditor from "@/components/admin/BlogPostEditor";

export default function AdminBlogNewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Nieuw artikel</h1>
      <BlogPostEditor />
    </div>
  );
}
