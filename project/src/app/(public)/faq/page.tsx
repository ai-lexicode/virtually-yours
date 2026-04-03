import { Metadata } from "next";
import { FaqContent } from "./FaqContent";

export const metadata: Metadata = {
  title: "Veelgestelde vragen — Virtually Yours",
  description:
    "Antwoorden op veelgestelde vragen over juridische documenten, tarieven, bestellingen en samenwerkingen bij Virtually Yours.",
};

export default function FaqPage() {
  return <FaqContent />;
}
