import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeading } from "./components/EmailHeading";
import { EmailText } from "./components/EmailText";
import { EmailButton } from "./components/EmailButton";

interface QuestionnaireReminderEmailProps {
  orderNumber: number;
  documentTitle: string;
  siteUrl: string;
}

export function QuestionnaireReminderEmail({
  orderNumber,
  documentTitle,
  siteUrl,
}: QuestionnaireReminderEmailProps) {
  return (
    <EmailLayout preview={`Herinnering: vul uw vragenlijst in — ${documentTitle}`}>
      <EmailHeading>Vergeet uw vragenlijst niet!</EmailHeading>
      <EmailText>
        U heeft de vragenlijst voor{" "}
        <strong style={{ color: "#1e293b" }}>{documentTitle}</strong> (bestelling
        #VY-{orderNumber}) nog niet voltooid.
      </EmailText>
      <EmailText>
        Vul de vragenlijst in zodat wij uw document op maat kunnen maken.
      </EmailText>
      <EmailButton href={`${siteUrl}/dashboard`}>
        Vragenlijst invullen
      </EmailButton>
    </EmailLayout>
  );
}
