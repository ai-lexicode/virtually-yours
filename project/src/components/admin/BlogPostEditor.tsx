"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogPostData {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  published_at: string | null;
  category_id: string | null;
  meta_title: string;
  meta_description: string;
}

interface BlogPostEditorProps {
  postId?: string;
}

export default function BlogPostEditor({ postId }: BlogPostEditorProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!postId);
  const [error, setError] = useState("");
  const [form, setForm] = useState<BlogPostData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    cover_image: "",
    status: "DRAFT",
    published_at: null,
    category_id: null,
    meta_title: "",
    meta_description: "",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog/categories");
      if (res.ok) setCategories(await res.json());
    } catch {}
  }, []);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    try {
      const res = await fetch(`/api/admin/blog/posts/${postId}`);
      if (!res.ok) throw new Error("Post not found");
      const post = await res.json();
      setForm({
        title: post.title || "",
        slug: post.slug || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        cover_image: post.cover_image || "",
        status: post.status || "DRAFT",
        published_at: post.published_at || null,
        category_id: post.category_id || null,
        meta_title: post.meta_title || "",
        meta_description: post.meta_description || "",
      });
    } catch {
      setError("Kan post niet laden");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchCategories();
    fetchPost();
  }, [fetchCategories, fetchPost]);

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = postId
        ? `/api/admin/blog/posts/${postId}`
        : "/api/admin/blog/posts";
      const method = postId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Opslaan mislukt");
      }

      const saved = await res.json();
      router.push(`/admin/blog/${saved.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!postId || !confirm("Weet je zeker dat je deze post wilt verwijderen?")) return;
    try {
      await fetch(`/api/admin/blog/posts/${postId}`, { method: "DELETE" });
      router.push("/admin/blog");
    } catch {
      setError("Verwijderen mislukt");
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-card rounded w-1/2" />
        <div className="h-64 bg-card rounded" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {error && (
        <div className="p-3 rounded bg-error/10 text-error text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Titel</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-foreground font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-foreground"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Content (Markdown)
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-foreground font-mono text-sm"
              rows={20}
              required
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border border-card-border bg-card p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Publicatie</h3>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as BlogPostData["status"] })
                }
                className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-foreground"
              >
                <option value="DRAFT">Concept</option>
                <option value="PUBLISHED">Gepubliceerd</option>
                <option value="ARCHIVED">Gearchiveerd</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Categorie</label>
              <select
                value={form.category_id || ""}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value || null })
                }
                className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-foreground"
              >
                <option value="">Geen categorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Cover image URL
              </label>
              <input
                type="text"
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                placeholder="/images/blog/..."
                className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-foreground text-sm"
              />
            </div>
          </div>

          <div className="rounded-lg border border-card-border bg-card p-4 space-y-4">
            <h3 className="font-semibold text-foreground">SEO</h3>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Meta titel</label>
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-foreground text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Meta beschrijving
              </label>
              <textarea
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-foreground text-sm"
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg btn-gradient px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Opslaan..." : postId ? "Bijwerken" : "Aanmaken"}
            </button>

            {postId && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full rounded-lg border border-error/30 text-error px-4 py-2.5 text-sm font-medium hover:bg-error/10 transition-colors"
              >
                Verwijderen
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
