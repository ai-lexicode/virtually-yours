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
        fontSize: 15,
        textDecoration: "none",
        borderRadius: 8,
        padding: "12px 32px",
        marginTop: 24,
        marginBottom: 24,
      }}
    >
      {children}
    </Button>
  );
}
