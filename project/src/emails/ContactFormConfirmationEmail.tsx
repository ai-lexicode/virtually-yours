import * as React from "react";
import { Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeading } from "./components/EmailHeading";
import { EmailText } from "./components/EmailText";

interface ContactFormConfirmationEmailProps {
  name: string;
  subject: string;
  message: string;
}

export function ContactFormConfirmationEmail({
  name,
  subject,
  message,
}: ContactFormConfirmationEmailProps) {
  return (
    <EmailLayout preview="Wij hebben uw bericht ontvangen — Virtually Yours">
      <EmailHeading>Bedankt voor uw bericht, {name}!</EmailHeading>
      <EmailText>
        Wij hebben uw bericht ontvangen en reageren binnen 24 uur op werkdagen.
      </EmailText>
      <EmailText>
        <strong style={{ color: "#1e293b" }}>Onderwerp:</strong> {subject}
      </EmailText>
      <EmailText style={{ fontWeight: "bold", color: "#1e293b" }}>
        Uw bericht:
      </EmailText>
      <Text
        style={{
          borderLeft: "3px solid #c89c6f",
          paddingLeft: 12,
          color: "#64748b",
          fontSize: 15,
          lineHeight: "1.6",
          whiteSpace: "pre-wrap",
        }}
      >
        {message}
      </Text>
      <EmailText style={{ marginTop: 16 }}>
        Met vriendelijke groet,
        <br />
        Het Virtually Yours team
      </EmailText>
    </EmailLayout>
  );
}
