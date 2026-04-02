import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary p-12">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Virtually Yours"
            width={200}
            height={52}
            className="h-14 w-auto brightness-0 invert"
          />
        </Link>
        <p className="mt-6 text-lg text-white/80 text-center max-w-sm">
          Uw juridische documenten, altijd binnen handbereik
        </p>
        <ul className="mt-10 space-y-4">
          {[
            "Veilig en versleuteld portaal",
            "Documenten altijd beschikbaar",
            "Voortgang opslaan en later verdergaan",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-white/70">
              <svg
                className="h-5 w-5 text-white shrink-0"
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
