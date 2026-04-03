import * as React from "react";
import { Text } from "@react-email/components";
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
      <EmailText>Of kopieer deze link in uw browser:</EmailText>
      <Text
        style={{
          wordBreak: "break-all",
          fontSize: 13,
          color: "#c89c6f",
          lineHeight: "1.6",
        }}
      >
        {resetUrl}
      </Text>
      <EmailText style={{ marginTop: 24, fontSize: 13 }}>
        Als u dit verzoek niet heeft ingediend, kunt u deze e-mail negeren. Uw
        wachtwoord blijft ongewijzigd.
      </EmailText>
    </EmailLayout>
  );
}
