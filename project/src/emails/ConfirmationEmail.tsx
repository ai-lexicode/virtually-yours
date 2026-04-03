import * as React from "react";
import { Text, Hr } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeading } from "./components/EmailHeading";
import { EmailText } from "./components/EmailText";
import { EmailButton } from "./components/EmailButton";

interface ConfirmationEmailProps {
  name: string;
  confirmUrl: string;
}

export function ConfirmationEmail({ name, confirmUrl }: ConfirmationEmailProps) {
  return (
    <EmailLayout preview="Bevestig uw account bij Virtually Yours">
      <EmailHeading>Welkom bij Virtually Yours!</EmailHeading>
      <EmailText style={{ color: "#1e293b" }}>Beste {name},</EmailText>
      <EmailText>
        Bedankt voor uw registratie. Klik op de onderstaande knop om uw
        e-mailadres te bevestigen en uw account te activeren.
      </EmailText>
      <EmailButton href={confirmUrl}>Account activeren</EmailButton>
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
        {confirmUrl}
      </Text>
      <Hr style={{ borderColor: "#e2e8f0", margin: "24px 0" }} />
      <EmailText style={{ fontSize: 13, color: "#94a3b8" }}>
        Deze link is 24 uur geldig. Als u geen account heeft aangemaakt, kunt u
        deze e-mail negeren.
      </EmailText>
    </EmailLayout>
  );
}
