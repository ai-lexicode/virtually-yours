import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeading } from "./components/EmailHeading";
import { EmailText } from "./components/EmailText";
import { EmailButton } from "./components/EmailButton";

interface PaymentConfirmationEmailProps {
  orderNumber: number;
  documentTitle: string;
  siteUrl: string;
}

export function PaymentConfirmationEmail({
  orderNumber,
  documentTitle,
  siteUrl,
}: PaymentConfirmationEmailProps) {
  return (
    <EmailLayout preview={`Betaling ontvangen — bestelling #VY-${orderNumber}`}>
      <EmailHeading>Betaling ontvangen!</EmailHeading>
      <EmailText>
        Uw betaling voor{" "}
        <strong style={{ color: "#1e293b" }}>{documentTitle}</strong> is
        succesvol verwerkt.
      </EmailText>
      <EmailText>
        U kunt nu de vragenlijst invullen in uw persoonlijke portaal.
      </EmailText>
      <EmailButton href={`${siteUrl}/dashboard`}>Naar mijn portaal</EmailButton>
      <EmailText>
        Bestelnummer:{" "}
        <strong style={{ color: "#1e293b" }}>#VY-{orderNumber}</strong>
      </EmailText>
    </EmailLayout>
  );
}
