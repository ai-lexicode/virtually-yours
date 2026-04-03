import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeading } from "./components/EmailHeading";
import { EmailText } from "./components/EmailText";
import { EmailButton } from "./components/EmailButton";

interface ChangesRequestedEmailProps {
  firstName: string;
  docTitle: string;
  note?: string;
  siteUrl: string;
}

export function ChangesRequestedEmail({
  firstName,
  docTitle,
  note,
  siteUrl,
}: ChangesRequestedEmailProps) {
  return (
    <EmailLayout preview={`Wijzigingen gevraagd: ${docTitle}`}>
      <EmailHeading>Hallo {firstName},</EmailHeading>
      <EmailText>
        Na beoordeling van uw document{" "}
        <strong style={{ color: "#1e293b" }}>{docTitle}</strong> zijn er enkele
        wijzigingen nodig.
      </EmailText>
      {note && (
        <EmailText>
          <strong style={{ color: "#1e293b" }}>Gevraagde wijzigingen:</strong>{" "}
          {note}
        </EmailText>
      )}
      <EmailText>
        U kunt uw antwoorden aanpassen via onderstaande link.
      </EmailText>
      <EmailButton href={`${siteUrl}/vragenlijsten`}>
        Pas uw antwoorden aan
      </EmailButton>
    </EmailLayout>
  );
}
