const variantColors: Record<string, string> = {
  privacy: "bg-secondary-container/40 text-secondary",
  commercieel: "bg-accent/30 text-secondary",
  arbeidsrecht: "bg-surface-container-high text-primary",
  ondernemingsrecht: "bg-surface-container text-primary-container",
  vastgoed: "bg-surface-container-low text-secondary",
  default: "bg-surface-container text-muted",
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
      className={`inline-block rounded-[0.25rem] px-3 py-1 text-xs font-medium font-label ${color} ${className}`}
    >
      {children}
    </span>
  );
}
