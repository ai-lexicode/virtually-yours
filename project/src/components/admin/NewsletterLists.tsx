"use client";

import { useState, useEffect, useCallback } from "react";

type ListItem = {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  createdAt: string;
};

type Member = {
  id: string;
  type: "user" | "lead";
  email: string;
  firstName: string;
  lastName: string;
  addedAt: string;
};

export default function NewsletterLists() {
  const [lists, setLists] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete" | "members" | null>(null);
  const [selected, setSelected] = useState<ListItem | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ id: string; type: "user" | "lead"; email: string; firstName: string; lastName: string }>>([]);
  const [searchDone, setSearchDone] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLists = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/newsletter/lists");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLists(data);
    } catch {
      showToast("Lijsten laden mislukt", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const fetchMembers = async (listId: string) => {
    setMembersLoading(true);
    try {
      const res = await fetch(`/api/admin/newsletter/lists/${listId}/members`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMembers(data);
    } catch {
      showToast("Leden laden mislukt", "error");
    } finally {
      setMembersLoading(false);
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/newsletter/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, description: formDesc || undefined }),
      });
      if (!res.ok) throw new Error();
      showToast("Lijst aangemaakt", "success");
      setModalType(null);
      setFormName("");
      setFormDesc("");
      fetchLists();
    } catch {
      showToast("Aanmaken mislukt", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/newsletter/lists/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, description: formDesc || null }),
      });
      if (!res.ok) throw new Error();
      showToast("Lijst bijgewerkt", "success");
      setModalType(null);
      fetchLists();
    } catch {
      showToast("Bijwerken mislukt", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/newsletter/lists/${selected.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      showToast("Lijst verwijderd", "success");
      setModalType(null);
      fetchLists();
    } catch {
      showToast("Verwijderen mislukt", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSearchContacts = async (query: string) => {
    setSearchEmail(query);
    setSearchDone(false);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/admin/newsletter/lists/search-contacts?q=${encodeURIComponent(query)}`);
      if (!res.ok) return;
      const data = await res.json();
      setSearchResults(data);
      setSearchDone(true);
    } catch {
      // ignore
    }
  };

  const handleAddMember = async (contact: { id: string; type: "user" | "lead" }) => {
    if (!selected) return;
    const body = contact.type === "user" ? { userId: contact.id } : { leadId: contact.id };
    try {
      const res = await fetch(`/api/admin/newsletter/lists/${selected.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.error === "ALREADY_MEMBER") {
          showToast("Al lid van deze lijst", "error");
          return;
        }
        throw new Error();
      }
      showToast("Lid toegevoegd", "success");
      setSearchEmail("");
      setSearchResults([]);
      setSearchDone(false);
      fetchMembers(selected.id);
      fetchLists();
    } catch {
      showToast("Toevoegen mislukt", "error");
    }
  };

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleAddByEmail = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`/api/admin/newsletter/lists/${selected.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: searchEmail.trim(),
          firstName: newFirstName.trim() || undefined,
          lastName: newLastName.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.error === "ALREADY_MEMBER") {
          showToast("Al lid van deze lijst", "error");
          return;
        }
        throw new Error();
      }
      showToast("Nieuw contact aangemaakt en toegevoegd", "success");
      setSearchEmail("");
      setSearchResults([]);
      setSearchDone(false);
      setNewFirstName("");
      setNewLastName("");
      fetchMembers(selected.id);
      fetchLists();
    } catch {
      showToast("Toevoegen mislukt", "error");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!selected) return;
    try {
      const res = await fetch(
        `/api/admin/newsletter/lists/${selected.id}/members?memberId=${memberId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      showToast("Lid verwijderd", "success");
      fetchMembers(selected.id);
      fetchLists();
    } catch {
      showToast("Verwijderen mislukt", "error");
    }
  };

  const openCreate = () => {
    setFormName("");
    setFormDesc("");
    setModalType("create");
  };

  const openEdit = (list: ListItem) => {
    setSelected(list);
    setFormName(list.name);
    setFormDesc(list.description || "");
    setModalType("edit");
  };

  const openDelete = (list: ListItem) => {
    setSelected(list);
    setModalType("delete");
  };

  const openMembers = (list: ListItem) => {
    setSelected(list);
    setSearchEmail("");
    setSearchResults([]);
    setSearchDone(false);
    setModalType("members");
    fetchMembers(list.id);
  };

  const inputClass = "w-full rounded-lg border border-[#333] bg-[#1a1a1a] text-white text-sm px-3 py-2 focus:border-primary focus:outline-none";

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          Lijsten
        </h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg btn-gradient font-semibold">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nieuwe lijst
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
        </div>
      ) : lists.length === 0 ? (
        <div className="text-center py-12 text-muted">Geen lijsten gevonden</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full">
            <thead className="bg-[#1a1a1a]">
              <tr>
                <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">Naam</th>
                <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">Beschrijving</th>
                <th className="text-center text-xs font-medium text-muted uppercase px-4 py-3">Leden</th>
                <th className="text-right text-xs font-medium text-muted uppercase px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {lists.map((list) => (
                <tr key={list.id} className="hover:bg-[#1a1a1a]/50">
                  <td className="px-4 py-3 text-white font-medium">{list.name}</td>
                  <td className="px-4 py-3 text-muted text-sm">{list.description || "\u2014"}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openMembers(list)}
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                      {list.memberCount}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(list)} className="p-1.5 rounded text-muted hover:text-white transition-colors" title="Bewerken">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button onClick={() => openDelete(list)} className="p-1.5 rounded text-red-400 hover:text-red-300 transition-colors" title="Verwijderen">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal backdrop */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModalType(null)}>
          <div className={`bg-[#222222] border border-[#333] rounded-xl p-6 mx-4 w-full ${modalType === "members" ? "max-w-2xl max-h-[80vh] overflow-y-auto" : "max-w-md"}`} onClick={(e) => e.stopPropagation()}>

            {/* Create */}
            {modalType === "create" && (
              <>
                <h2 className="text-lg font-bold text-white mb-4">Nieuwe lijst</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Naam</label>
                    <input value={formName} onChange={(e) => setFormName(e.target.value)} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Beschrijving</label>
                    <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className={inputClass} rows={3} />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setModalType(null)} className="px-4 py-2 text-sm rounded-lg border border-[#333] text-muted hover:text-white transition-colors">
                    Annuleren
                  </button>
                  <button onClick={handleCreate} disabled={!formName.trim() || saving} className="px-4 py-2 text-sm rounded-lg btn-gradient font-semibold disabled:opacity-50">
                    {saving ? "Aanmaken..." : "Aanmaken"}
                  </button>
                </div>
              </>
            )}

            {/* Edit */}
            {modalType === "edit" && (
              <>
                <h2 className="text-lg font-bold text-white mb-4">Lijst bewerken</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Naam</label>
                    <input value={formName} onChange={(e) => setFormName(e.target.value)} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Beschrijving</label>
                    <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className={inputClass} rows={3} />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setModalType(null)} className="px-4 py-2 text-sm rounded-lg border border-[#333] text-muted hover:text-white transition-colors">
                    Annuleren
                  </button>
                  <button onClick={handleEdit} disabled={!formName.trim() || saving} className="px-4 py-2 text-sm rounded-lg btn-gradient font-semibold disabled:opacity-50">
                    {saving ? "Opslaan..." : "Opslaan"}
                  </button>
                </div>
              </>
            )}

            {/* Delete */}
            {modalType === "delete" && (
              <>
                <h2 className="text-lg font-bold text-white mb-2">Lijst verwijderen</h2>
                <p className="text-muted text-sm mb-6">
                  Weet u zeker dat u de lijst &ldquo;{selected?.name}&rdquo; wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
                </p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setModalType(null)} className="px-4 py-2 text-sm rounded-lg border border-[#333] text-muted hover:text-white transition-colors">
                    Annuleren
                  </button>
                  <button onClick={handleDelete} disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-semibold disabled:opacity-50">
                    {saving ? "Verwijderen..." : "Verwijderen"}
                  </button>
                </div>
              </>
            )}

            {/* Members */}
            {modalType === "members" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Leden &mdash; {selected?.name}</h2>
                  <button onClick={() => setModalType(null)} className="text-muted hover:text-white">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Add member search */}
                <div className="space-y-2 mb-4">
                  <label className="text-white text-sm font-medium">Lid toevoegen</label>
                  <input
                    value={searchEmail}
                    onChange={(e) => handleSearchContacts(e.target.value)}
                    placeholder="Zoek op e-mail of naam..."
                    className={inputClass}
                  />
                  {searchResults.length > 0 && (
                    <div className="border border-[#333] rounded-lg overflow-hidden">
                      {searchResults.map((contact) => (
                        <button
                          key={`${contact.type}-${contact.id}`}
                          onClick={() => handleAddMember(contact)}
                          className="w-full text-left px-3 py-2 hover:bg-primary/10 text-sm text-white flex justify-between items-center"
                        >
                          <span className="flex items-center gap-2">
                            {contact.firstName} {contact.lastName}
                            <span className={`text-xs px-1.5 py-0.5 rounded ${contact.type === "user" ? "bg-blue-500/20 text-blue-300" : "bg-amber-500/20 text-amber-300"}`}>
                              {contact.type === "user" ? "Gebruiker" : "Lead"}
                            </span>
                          </span>
                          <span className="text-muted text-xs">{contact.email}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchDone && searchResults.length === 0 && isValidEmail(searchEmail.trim()) && (
                    <div className="border border-[#333] rounded-lg p-3 space-y-2">
                      <p className="text-muted text-sm">Niet gevonden. Voeg toe als nieuw contact:</p>
                      <div className="flex gap-2">
                        <input value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} placeholder="Voornaam" className={inputClass + " flex-1"} />
                        <input value={newLastName} onChange={(e) => setNewLastName(e.target.value)} placeholder="Achternaam" className={inputClass + " flex-1"} />
                        <button onClick={handleAddByEmail} className="px-3 py-2 text-xs rounded-lg btn-gradient font-semibold whitespace-nowrap">
                          Toevoegen
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Members list */}
                {membersLoading ? (
                  <div className="flex justify-center py-4">
                    <svg className="h-6 w-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-muted text-center py-4 text-sm">Geen leden</p>
                ) : (
                  <div className="space-y-1">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#1a1a1a]/50"
                      >
                        <div>
                          <span className="text-white text-sm">{member.firstName} {member.lastName}</span>
                          <span className="text-muted text-xs ml-2">{member.email}</span>
                          <span className="text-xs ml-2 px-1.5 py-0.5 rounded bg-primary/10 text-primary">{member.type}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 rounded text-red-400 hover:text-red-300"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
