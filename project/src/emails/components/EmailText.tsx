import { Text } from "@react-email/components";
import * as React from "react";

interface EmailTextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function EmailText({ children, style }: EmailTextProps) {
  return (
    <Text
      style={{
        color: "#64748b",
        fontSize: 15,
        lineHeight: "1.6",
        margin: "0 0 12px",
        ...style,
      }}
    >
      {children}
    </Text>
  );
}
