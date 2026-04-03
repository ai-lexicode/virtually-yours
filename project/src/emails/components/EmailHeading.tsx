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
        margin: "0 0 16px",
        fontSize: 22,
        color: "#1e293b",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {children}
    </Heading>
  );
}
