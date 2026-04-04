"use client";

import { useState, useEffect, useCallback } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export default function BlogCategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "" });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog/categories");
      if (res.ok) setCategories(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const url = editingId
        ? `/api/admin/blog/categories/${editingId}`
        : "/api/admin/blog/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Opslaan mislukt");

      setForm({ name: "", slug: "" });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opslaan mislukt");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Weet je zeker dat je deze categorie wilt verwijderen?")) return;
    try {
      await fetch(`/api/admin/blog/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch {
      setError("Verwijderen mislukt");
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ name: "", slug: "" });
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded bg-error/10 text-error text-sm">{error}</div>
      )}

      {/* Add/Edit form */}
      <form onSubmit={handleSave} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Naam</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({
                name: e.target.value,
                slug: editingId ? form.slug : generateSlug(e.target.value),
              })
            }
            className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground w-48"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground font-mono w-48"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded-lg btn-gradient px-4 py-2 text-sm font-semibold"
        >
          {editingId ? "Bijwerken" : "Toevoegen"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            Annuleren
          </button>
        )}
      </form>

      {/* Table */}
      <div className="rounded-lg border border-card-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr className="text-left text-muted">
              <th className="px-4 py-3 font-medium">Naam</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3" colSpan={3}>
                    <div className="h-5 bg-card rounded animate-pulse w-1/3" />
                  </td>
                </tr>
              ))
            ) : !categories.length ? (
              <tr>
                <td className="px-4 py-8 text-center text-muted" colSpan={3}>
                  Geen categorieën gevonden
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-4 py-3 text-foreground font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-muted font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-xs text-primary hover:underline"
                    >
                      Bewerken
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs text-error hover:underline"
                    >
                      Verwijderen
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
