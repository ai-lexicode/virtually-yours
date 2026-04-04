"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function InstellingenPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    documentReady: true,
    marketing: false,
  });
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    kvkNumber: "",
    btwNumber: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Load notification preferences from user metadata
      const notifPrefs = user.user_metadata?.notifications;
      if (notifPrefs) {
        setNotifications((prev) => ({
          ...prev,
          email: notifPrefs.email ?? true,
          documentReady: notifPrefs.documentReady ?? true,
        }));
      }

      // Load newsletter subscription status from API
      try {
        const nlRes = await fetch("/api/newsletter/preferences");
        if (nlRes.ok) {
          const nlData = await nlRes.json();
          setNotifications((prev) => ({
            ...prev,
            marketing: nlData.isActive ?? false,
          }));
        } else {
          // 404 or other error — default to false
          setNotifications((prev) => ({ ...prev, marketing: false }));
        }
      } catch {
        setNotifications((prev) => ({ ...prev, marketing: false }));
      }

      setProfile((prev) => ({ ...prev, email: user.email ?? "" }));

      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile({
          firstName: data.first_name ?? "",
          lastName: data.last_name ?? "",
          email: user.email ?? "",
          companyName: data.company_name ?? "",
          kvkNumber: data.kvk_number ?? "",
          btwNumber: data.btw_number ?? "",
          phone: data.phone ?? "",
        });
      }
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessage("Fout: u bent niet ingelogd. Vernieuw de pagina.");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: profile.firstName,
          last_name: profile.lastName,
          company_name: profile.companyName || null,
          kvk_number: profile.kvkNumber || null,
          btw_number: profile.btwNumber || null,
          phone: profile.phone || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(`Fout bij opslaan: ${data.error || "Onbekende fout"}`);
      } else {
        setMessage("Opgeslagen!");
      }
    } catch {
      setMessage("Fout bij opslaan. Probeer het opnieuw.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  async function handlePasswordChange() {
    setPasswordError("");
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Vul alle velden in.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Nieuw wachtwoord moet minimaal 8 tekens bevatten.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Wachtwoorden komen niet overeen.");
      return;
    }

    setChangingPassword(true);

    // Verify current password by signing in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: currentPassword,
    });

    if (signInError) {
      setPasswordError("Huidig wachtwoord is onjuist.");
      setChangingPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordError("Fout bij wijzigen wachtwoord.");
    } else {
      setPasswordMessage("Wachtwoord succesvol gewijzigd.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setChangingPassword(false);
    setTimeout(() => {
      setPasswordMessage("");
      setPasswordError("");
    }, 3000);
  }

  async function handleNotificationChange(key: string, value: boolean) {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);

    // Keep metadata in sync for backward compat
    await supabase.auth.updateUser({
      data: { notifications: updated },
    });

    // For the marketing/newsletter toggle, also update newsletter_subscriptions
    if (key === "marketing") {
      try {
        await fetch("/api/newsletter/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: value, general: value }),
        });
      } catch {
        // Silently fail — metadata update already persisted
      }
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Instellingen</h1>
        <p className="text-muted mt-1">
          Beheer uw account- en bedrijfsgegevens.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.includes("Fout")
              ? "bg-error/10 text-error"
              : "bg-success/10 text-success"
          }`}
        >
          {message}
        </div>
      )}

      {/* Personal info */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Persoonlijke gegevens</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Voornaam</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) =>
                setProfile((p) => ({ ...p, firstName: e.target.value }))
              }
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">
              Achternaam
            </label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) =>
                setProfile((p) => ({ ...p, lastName: e.target.value }))
              }
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-muted mb-1.5">
              E-mailadres
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-muted cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Company info */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Bedrijfsgegevens</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">
              Bedrijfsnaam
            </label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) =>
                setProfile((p) => ({ ...p, companyName: e.target.value }))
              }
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">
              KvK-nummer
            </label>
            <input
              type="text"
              value={profile.kvkNumber}
              onChange={(e) =>
                setProfile((p) => ({ ...p, kvkNumber: e.target.value }))
              }
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">
              BTW-nummer
            </label>
            <input
              type="text"
              value={profile.btwNumber}
              onChange={(e) =>
                setProfile((p) => ({ ...p, btwNumber: e.target.value }))
              }
              placeholder="NL000000000B00"
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">
              Telefoonnummer
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+31 6 12345678"
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Notificaties</h2>
        <div className="space-y-4">
          {[
            {
              key: "email" as const,
              label: "E-mailnotificaties",
              desc: "Ontvang updates over uw bestellingen per e-mail",
            },
            {
              key: "documentReady" as const,
              label: "Document gereed",
              desc: "Melding wanneer een document klaar is voor download",
            },
            {
              key: "marketing" as const,
              label: "Nieuwsbrief",
              desc: "Ontvang aanbiedingen en tips voor uw bedrijf",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  handleNotificationChange(item.key, !notifications[item.key])
                }
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  notifications[item.key] ? "bg-primary" : "bg-card-border"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    notifications[item.key]
                      ? "translate-x-7"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Password */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Wachtwoord wijzigen</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">
              Huidig wachtwoord
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">
              Nieuw wachtwoord
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">
              Bevestig nieuw wachtwoord
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          {passwordError && (
            <p className="text-sm text-error">{passwordError}</p>
          )}
          {passwordMessage && (
            <p className="text-sm text-success">{passwordMessage}</p>
          )}
          <button
            onClick={handlePasswordChange}
            disabled={changingPassword}
            className="bg-primary text-background px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {changingPassword ? "Bezig..." : "Wachtwoord wijzigen"}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm text-error hover:text-error/80 transition-colors"
          >
            Account verwijderen
          </button>
        ) : (
          <div className="bg-error/10 border border-error/30 rounded-lg p-4 space-y-3">
            <p className="text-sm text-foreground">
              Typ <strong>VERWIJDEREN</strong> om uw account permanent te verwijderen. Dit kan niet ongedaan worden gemaakt.
            </p>
            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="Typ VERWIJDEREN"
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  if (deleteText !== "VERWIJDEREN") return;
                  setDeleting(true);
                  const res = await fetch("/api/auth/delete-account", { method: "DELETE" });
                  if (res.ok) {
                    await supabase.auth.signOut();
                    window.location.href = "/";
                  } else {
                    setDeleting(false);
                  }
                }}
                disabled={deleteText !== "VERWIJDEREN" || deleting}
                className="bg-error text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                {deleting ? "Bezig..." : "Definitief verwijderen"}
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteText(""); }}
                className="text-sm text-muted hover:text-foreground"
              >
                Annuleren
              </button>
            </div>
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary-hover text-background font-medium text-sm px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Opslaan..." : "Opslaan"}
        </button>
      </div>
    </div>
  );
}
