import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeading } from "./components/EmailHeading";
import { EmailText } from "./components/EmailText";
import { EmailButton } from "./components/EmailButton";

interface DocumentReadyEmailProps {
  orderNumber: number;
  documentTitle: string;
  siteUrl: string;
}

export function DocumentReadyEmail({
  orderNumber,
  documentTitle,
  siteUrl,
}: DocumentReadyEmailProps) {
  return (
    <EmailLayout preview={`Uw document is gereed — ${documentTitle}`}>
      <EmailHeading>Uw document is gereed!</EmailHeading>
      <EmailText>
        Uw <strong style={{ color: "#1e293b" }}>{documentTitle}</strong>{" "}
        (bestelling #VY-{orderNumber}) is gecontroleerd en klaar voor download.
      </EmailText>
      <EmailText>
        U kunt het document downloaden als PDF of Word in uw portaal.
      </EmailText>
      <EmailButton href={`${siteUrl}/downloads`}>Naar downloads</EmailButton>
    </EmailLayout>
  );
}
