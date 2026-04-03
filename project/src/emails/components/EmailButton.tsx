import { Button } from "@react-email/components";
import * as React from "react";

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
}

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Button
      href={href}
      style={{
        display: "inline-block",
        background: "linear-gradient(135deg, #c89c6f 0%, #d4a853 100%)",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: 16,
        textDecoration: "none",
        borderRadius: 8,
        padding: "14px 40px",
        marginTop: 28,
        marginBottom: 28,
        boxShadow: "0 2px 8px rgba(200, 156, 111, 0.35)",
        letterSpacing: "0.3px",
      }}
    >
      {children}
    </Button>
  );
}
