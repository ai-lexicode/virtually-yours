import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export default async function DownloadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Use service role to query across relations and generate signed URLs
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: generatedDocs } = await admin
    .from("generated_documents")
    .select(
      "id, storage_path, file_type, version, created_at, order_items(documents(title), orders(order_number, profile_id))"
    )
    .eq("order_items.orders.profile_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  // Generate signed URLs for each document
  const downloads = await Promise.all(
    (generatedDocs || []).map(async (doc) => {
      const orderItem = doc.order_items as unknown as {
        documents: { title: string };
        orders: { order_number: string };
      } | null;

      let fileUrl = "";
      if (doc.storage_path) {
        const { data: signedData } = await admin.storage
          .from("documents")
          .createSignedUrl(doc.storage_path, 3600); // 1 hour
        fileUrl = signedData?.signedUrl ?? "";
      }

      return {
        id: doc.id,
        title: orderItem?.documents?.title ?? "Document",
        orderId: orderItem?.orders?.order_number ?? "-",
        generatedAt: doc.created_at
          ? new Date(doc.created_at).toLocaleDateString("nl-NL")
          : "-",
        fileType: (doc.file_type ?? "pdf").toUpperCase(),
        fileSize: "-",
        version: doc.version ?? 1,
        fileUrl,
      };
    })
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Downloads</h1>
        <p className="text-muted mt-1">
          Download uw gegenereerde documenten.
        </p>
      </div>

      {downloads.length > 0 ? (
        <div className="space-y-4">
          {downloads.map((doc) => (
            <div
              key={doc.id}
              className="bg-card border border-card-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-error/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-error">
                    {doc.fileType}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{doc.title}</h3>
                  <p className="text-sm text-muted">
                    {doc.orderId} &middot; v{doc.version} &middot;{" "}
                    {doc.fileSize} &middot; {doc.generatedAt}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground border border-card-border rounded-lg px-4 py-2 transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Bekijken
                  </a>
                )}
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    download
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Downloaden
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-card-border rounded-xl p-12 text-center">
          <svg
            className="h-12 w-12 text-muted mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          <h3 className="mt-4 font-semibold">Nog geen downloads</h3>
          <p className="text-sm text-muted mt-1">
            Uw gegenereerde documenten verschijnen hier zodra ze gereed zijn.
          </p>
        </div>
      )}

      {/* Info box */}
      <div className="bg-info/5 border border-info/20 rounded-xl p-5">
        <div className="flex gap-3">
          <svg
            className="h-5 w-5 text-info shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-info">
              Uw documenten blijven 90 dagen beschikbaar
            </p>
            <p className="text-xs text-muted mt-1">
              Na 90 dagen worden downloads automatisch verwijderd. Sla uw
              documenten lokaal op voor uw eigen administratie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
