import * as React from "react";
import { Text, Link, Hr } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeading } from "./components/EmailHeading";
import { EmailText } from "./components/EmailText";

interface NewsletterWelcomeEmailProps {
  unsubscribeUrl?: string;
}

export function NewsletterWelcomeEmail({
  unsubscribeUrl,
}: NewsletterWelcomeEmailProps) {
  return (
    <EmailLayout preview="Welkom bij de Virtually Yours newsletter">
      <EmailHeading>Welkom!</EmailHeading>
      <EmailText style={{ color: "#1e293b" }}>
        Uw aanmelding voor de Virtually Yours newsletter is bevestigd.
      </EmailText>
      <EmailText>
        U ontvangt voortaan juridische tips, updates over nieuwe documenten en
        praktisch advies rechtstreeks in uw inbox.
      </EmailText>
      <EmailText>
        Heeft u vragen of suggesties? Neem gerust contact met ons op via{" "}
        <Link
          href="mailto:info@virtually-yours.nl"
          style={{ color: "#c89c6f", textDecoration: "none" }}
        >
          info@virtually-yours.nl
        </Link>
        .
      </EmailText>
      {unsubscribeUrl && (
        <>
          <Hr style={{ borderColor: "#e2e8f0", margin: "24px 0" }} />
          <Text
            style={{
              fontSize: 12,
              color: "#94a3b8",
              lineHeight: "1.5",
              margin: 0,
              textAlign: "center" as const,
            }}
          >
            Wilt u geen e-mails meer ontvangen?{" "}
            <Link
              href={unsubscribeUrl}
              style={{ color: "#c89c6f", textDecoration: "underline" }}
            >
              Uitschrijven
            </Link>
          </Text>
        </>
      )}
    </EmailLayout>
  );
}
