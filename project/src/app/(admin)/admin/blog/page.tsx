import BlogPostList from "@/components/admin/BlogPostList";

export default function AdminBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Blog</h1>
      <BlogPostList />
    </div>
  );
}
