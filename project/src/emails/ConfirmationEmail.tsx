import * as React from "react";
import { Text } from "@react-email/components";
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
      <EmailText>Of kopieer deze link in uw browser:</EmailText>
      <Text
        style={{
          wordBreak: "break-all",
          fontSize: 13,
          color: "#c89c6f",
          lineHeight: "1.6",
        }}
      >
        {confirmUrl}
      </Text>
      <EmailText style={{ marginTop: 24, fontSize: 13 }}>
        Deze link is 24 uur geldig. Als u geen account heeft aangemaakt, kunt u
        deze e-mail negeren.
      </EmailText>
    </EmailLayout>
  );
}
