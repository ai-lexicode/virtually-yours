"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
  blog_categories: { name: string; slug: string } | null;
}

interface PostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
}

const statusLabels: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Concept", className: "bg-muted/20 text-muted" },
  PUBLISHED: { label: "Gepubliceerd", className: "bg-green-500/20 text-green-400" },
  ARCHIVED: { label: "Gearchiveerd", className: "bg-amber-500/20 text-amber-400" },
};

export default function BlogPostList() {
  const [data, setData] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({ status: "", category: "", search: "", page: 1 });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(filters.page));
      if (filters.status) params.set("status", filters.status);
      if (filters.category) params.set("category", filters.category);
      if (filters.search) params.set("search", filters.search);

      const res = await fetch(`/api/admin/blog/posts?${params}`);
      if (res.ok) setData(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog/categories");
      if (res.ok) setCategories(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Zoeken..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground w-48"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="">Alle statussen</option>
          <option value="DRAFT">Concept</option>
          <option value="PUBLISHED">Gepubliceerd</option>
          <option value="ARCHIVED">Gearchiveerd</option>
        </select>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
          className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="">Alle categorieën</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <div className="ml-auto">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-lg btn-gradient px-4 py-2.5 text-sm font-semibold"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nieuw artikel
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-card-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr className="text-left text-muted">
              <th className="px-4 py-3 font-medium">Titel</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Categorie</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Status</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Datum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3" colSpan={4}>
                    <div className="h-5 bg-card rounded animate-pulse w-2/3" />
                  </td>
                </tr>
              ))
            ) : !data?.posts.length ? (
              <tr>
                <td className="px-4 py-8 text-center text-muted" colSpan={4}>
                  Geen artikelen gevonden
                </td>
              </tr>
            ) : (
              data.posts.map((post) => {
                const st = statusLabels[post.status] || statusLabels.DRAFT;
                return (
                  <tr key={post.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-muted mt-0.5 font-mono">/{post.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted">
                      {post.blog_categories?.name || "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${st.className}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted text-xs">
                      {formatDate(post.published_at || post.created_at)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page <= 1}
            className="rounded-lg border border-card-border px-3 py-1.5 text-sm text-muted hover:text-foreground disabled:opacity-30"
          >
            Vorige
          </button>
          <span className="text-sm text-muted">
            {filters.page} / {data.totalPages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page >= data.totalPages}
            className="rounded-lg border border-card-border px-3 py-1.5 text-sm text-muted hover:text-foreground disabled:opacity-30"
          >
            Volgende
          </button>
        </div>
      )}
    </div>
  );
}
