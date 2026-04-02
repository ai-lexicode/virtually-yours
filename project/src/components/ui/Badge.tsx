const variantColors: Record<string, string> = {
  privacy: "bg-primary/20 text-primary",
  commercieel: "bg-accent/20 text-accent",
  arbeidsrecht: "bg-primary/15 text-primary-hover",
  ondernemingsrecht: "bg-primary-dark/20 text-primary",
  vastgoed: "bg-accent/15 text-accent",
  default: "bg-surface-container-high text-muted",
};

interface BadgeProps {
  variant?: string;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  const color = variantColors[variant] || variantColors.default;
  return (
    <span
      className={`inline-block rounded-lg px-3 py-1 text-xs font-medium font-label ${color} ${className}`}
    >
      {children}
    </span>
  );
}
