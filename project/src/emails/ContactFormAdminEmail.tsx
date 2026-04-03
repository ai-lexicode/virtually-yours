import * as React from "react";
import { Section, Row, Column } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeading } from "./components/EmailHeading";
import { EmailText } from "./components/EmailText";

interface ContactFormAdminEmailProps {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

export function ContactFormAdminEmail({
  name,
  email,
  company,
  subject,
  message,
}: ContactFormAdminEmailProps) {
  const fields = [
    { label: "Naam", value: name },
    { label: "E-mail", value: email },
    ...(company ? [{ label: "Bedrijf", value: company }] : []),
    { label: "Onderwerp", value: subject },
  ];

  return (
    <EmailLayout preview={`Nieuw contactbericht van ${name}`}>
      <EmailHeading>Nieuw contactbericht</EmailHeading>
      <Section>
        {fields.map((field) => (
          <Row key={field.label} style={{ marginBottom: 4 }}>
            <Column style={{ padding: 8, fontWeight: "bold", color: "#1e293b", width: 120 }}>
              {field.label}:
            </Column>
            <Column style={{ padding: 8, color: "#64748b" }}>
              {field.value}
            </Column>
          </Row>
        ))}
      </Section>
      <EmailText style={{ marginTop: 16, fontWeight: "bold", color: "#1e293b" }}>
        Bericht:
      </EmailText>
      <EmailText style={{ whiteSpace: "pre-wrap" }}>{message}</EmailText>
    </EmailLayout>
  );
}
