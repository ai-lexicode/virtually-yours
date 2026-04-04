import BlogCategoryManager from "@/components/admin/BlogCategoryManager";

export default function AdminBlogCategoriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Blog Categorieën</h1>
      <BlogCategoryManager />
    </div>
  );
}
