import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="md:ml-60 min-h-screen">
        <header className="h-16 border-b border-card-border flex items-center justify-between px-4 sm:px-6 pl-14 md:pl-6">
          <div />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
              A
            </div>
            <div className="text-sm">
              <p className="font-medium text-on-surface">Admin</p>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
