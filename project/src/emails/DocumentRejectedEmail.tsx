import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeading } from "./components/EmailHeading";
import { EmailText } from "./components/EmailText";
import { EmailButton } from "./components/EmailButton";

interface DocumentRejectedEmailProps {
  firstName: string;
  docTitle: string;
  note?: string;
  siteUrl: string;
}

export function DocumentRejectedEmail({
  firstName,
  docTitle,
  note,
  siteUrl,
}: DocumentRejectedEmailProps) {
  return (
    <EmailLayout preview={`Actie vereist: ${docTitle}`}>
      <EmailHeading>Hallo {firstName},</EmailHeading>
      <EmailText>
        Uw document <strong style={{ color: "#1e293b" }}>{docTitle}</strong>{" "}
        vereist aanpassingen.
      </EmailText>
      {note && (
        <EmailText>
          <strong style={{ color: "#1e293b" }}>Reden:</strong> {note}
        </EmailText>
      )}
      <EmailButton href={`${siteUrl}/vragenlijsten`}>
        Pas uw antwoorden aan
      </EmailButton>
    </EmailLayout>
  );
}
