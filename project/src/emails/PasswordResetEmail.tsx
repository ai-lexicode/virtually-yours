import * as React from "react";
import { Text, Hr } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeading } from "./components/EmailHeading";
import { EmailText } from "./components/EmailText";
import { EmailButton } from "./components/EmailButton";

interface PasswordResetEmailProps {
  resetUrl: string;
}

export function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {
  return (
    <EmailLayout preview="Wachtwoord resetten — Virtually Yours">
      <EmailHeading>Wachtwoord resetten</EmailHeading>
      <EmailText>
        U heeft een verzoek ingediend om uw wachtwoord te resetten.
      </EmailText>
      <EmailText>
        Klik op de onderstaande knop om een nieuw wachtwoord in te stellen.
      </EmailText>
      <EmailButton href={resetUrl}>Nieuw wachtwoord instellen</EmailButton>
      <Text
        style={{
          fontSize: 13,
          color: "#94a3b8",
          lineHeight: "1.5",
          margin: "0 0 8px",
        }}
      >
        Of kopieer deze link in uw browser:
      </Text>
      <Text
        style={{
          wordBreak: "break-all",
          fontSize: 12,
          color: "#c89c6f",
          lineHeight: "1.5",
          margin: "0 0 0",
          padding: "12px 16px",
          backgroundColor: "#f8f6f3",
          borderRadius: 6,
          border: "1px solid #e8e0d6",
        }}
      >
        {resetUrl}
      </Text>
      <Hr style={{ borderColor: "#e2e8f0", margin: "24px 0" }} />
      <EmailText style={{ fontSize: 13, color: "#94a3b8" }}>
        Als u dit verzoek niet heeft ingediend, kunt u deze e-mail negeren. Uw
        wachtwoord blijft ongewijzigd.
      </EmailText>
    </EmailLayout>
  );
}
