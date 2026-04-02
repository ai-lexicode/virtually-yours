import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: { first_name: string | null; last_name: string | null; company_name: string | null } | null = null;
  if (user) {
    // Use service role to bypass RLS (regular client gets blocked)
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await serviceClient
      .from("profiles")
      .select("first_name, last_name, company_name")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const initials = profile
    ? `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase()
    : "?";
  const displayName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    : "Gebruiker";

  return (
    <div className="min-h-screen">
      <PortalSidebar />
      <main className="md:ml-60 min-h-screen">
        <header className="h-16 border-b border-card-border flex items-center justify-end px-4 sm:px-6 gap-4 pl-14 md:pl-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
              {initials}
            </div>
            <div className="text-sm">
              <p className="font-medium">{displayName}</p>
              {profile?.company_name && (
                <p className="text-xs text-muted">{profile.company_name}</p>
              )}
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
