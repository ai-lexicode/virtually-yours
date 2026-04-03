import { Heading } from "@react-email/components";
import * as React from "react";

interface EmailHeadingProps {
  children: React.ReactNode;
}

export function EmailHeading({ children }: EmailHeadingProps) {
  return (
    <Heading
      as="h1"
      style={{
        margin: "0 0 20px",
        fontSize: 24,
        fontWeight: 700,
        color: "#1e293b",
        letterSpacing: "-0.3px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {children}
    </Heading>
  );
}
