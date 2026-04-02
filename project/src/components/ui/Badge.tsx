const variantColors: Record<string, string> = {
  privacy: "bg-teal-500/20 text-teal-600",
  commercieel: "bg-amber-500/20 text-amber-600",
  arbeidsrecht: "bg-blue-500/20 text-blue-600",
  ondernemingsrecht: "bg-purple-500/20 text-purple-600",
  vastgoed: "bg-emerald-500/20 text-emerald-600",
  default: "bg-gray-500/20 text-gray-600",
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
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${color} ${className}`}
    >
      {children}
    </span>
  );
}
