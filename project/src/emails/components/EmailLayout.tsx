import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
  Hr,
} from "@react-email/components";
import * as React from "react";

const LOGO_URL = "https://virtually-yours.nl/images/logo-full.png";
const SITE_URL = "https://virtually-yours.nl";
const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

interface EmailLayoutProps {
  preview?: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  const year = new Date().getFullYear();

  return (
    <Html lang="nl">
      <Head />
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#1a1a1a",
          fontFamily: FONT_STACK,
        }}
      >
        {preview && (
          <Text style={{ display: "none", maxHeight: 0, overflow: "hidden" }}>
            {preview}
          </Text>
        )}
        <Container
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          {/* Header with logo */}
          <Section style={{ textAlign: "center" as const, padding: "40px 0 32px" }}>
            <Img
              src={LOGO_URL}
              alt="Virtually Yours"
              width={220}
              height="auto"
              style={{ margin: "0 auto" }}
            />
          </Section>

          {/* Card body */}
          <Section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: "0",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
              overflow: "hidden" as const,
            }}
          >
            {/* Gold accent bar */}
            <div
              style={{
                height: 4,
                background: "linear-gradient(90deg, #c89c6f 0%, #d4a853 50%, #c89c6f 100%)",
              }}
            />
            <div style={{ padding: "36px 40px 32px" }}>
              {children}
            </div>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: "center" as const, padding: "24px 32px" }}>
            <Hr style={{ borderColor: "#3a3a3a", margin: "0 0 16px" }} />
            <Text
              style={{
                margin: 0,
                fontSize: 12,
                color: "#94a3b8",
                lineHeight: "20px",
              }}
            >
              &copy; {year} Virtually Yours — Jouw juridische documenten op maat
            </Text>
            <Text
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "#94a3b8",
                lineHeight: "20px",
              }}
            >
              KvK: 76053881 | BTW: NL003038893B59 | +31 (0)6 18755103
            </Text>
            <Link
              href={SITE_URL}
              style={{
                display: "inline-block",
                marginTop: 8,
                fontSize: 12,
                color: "#c89c6f",
                textDecoration: "none",
              }}
            >
              virtually-yours.nl
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
