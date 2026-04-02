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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
