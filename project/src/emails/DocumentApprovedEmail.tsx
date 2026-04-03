import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeading } from "./components/EmailHeading";
import { EmailText } from "./components/EmailText";
import { EmailButton } from "./components/EmailButton";

interface DocumentApprovedEmailProps {
  firstName: string;
  docTitle: string;
  note?: string;
  siteUrl: string;
}

export function DocumentApprovedEmail({
  firstName,
  docTitle,
  note,
  siteUrl,
}: DocumentApprovedEmailProps) {
  return (
    <EmailLayout preview={`Uw document "${docTitle}" is gereed`}>
      <EmailHeading>Goed nieuws, {firstName}!</EmailHeading>
      <EmailText>
        Uw document <strong style={{ color: "#1e293b" }}>{docTitle}</strong> is
        goedgekeurd en klaar om te downloaden.
      </EmailText>
      {note && (
        <EmailText>
          <strong style={{ color: "#1e293b" }}>Opmerking:</strong> {note}
        </EmailText>
      )}
      <EmailButton href={`${siteUrl}/downloads`}>
        Download uw document
      </EmailButton>
    </EmailLayout>
  );
}
