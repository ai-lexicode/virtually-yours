import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-sidebar p-12">
        <Link href="/" className="text-4xl font-bold text-primary">
          Virtually Yours
        </Link>
        <p className="mt-4 text-lg text-muted text-center">
          Uw juridische documenten, altijd binnen handbereik
        </p>
        <ul className="mt-10 space-y-4">
          {[
            "Veilig en versleuteld portaal",
            "Documenten altijd beschikbaar",
            "Voortgang opslaan en later verdergaan",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-muted">
              <svg
                className="h-5 w-5 text-primary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
