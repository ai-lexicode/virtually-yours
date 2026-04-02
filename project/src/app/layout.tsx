import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virtually Yours — Jouw juridische documenten op maat",
  description:
    "Juridische documenten op maat voor online professionals, VA's, OBM's en SMM's in Nederland. Snel, betaalbaar en professioneel.",
  keywords: [
    "juridische documenten",
    "virtueel assistent",
    "VA documenten",
    "verwerkersovereenkomst",
    "algemene voorwaarden",
    "privacyverklaring",
    "online ondernemer",
    "Nederland",
  ],
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    title: "Virtually Yours — Jouw juridische documenten op maat",
    description:
      "Juridische documenten op maat voor online professionals, VA's, OBM's en SMM's in Nederland.",
    url: "https://virtually-yours.nl",
    siteName: "Virtually Yours",
    locale: "nl_NL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <meta name="theme-color" content="#1a1a1a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@400;500;600;700&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">{children}</body>
    </html>
  );
}
