import Link from "next/link";

const variants = {
  primary:
    "bg-primary text-background hover:bg-primary-hover",
  secondary:
    "bg-primary/10 text-primary hover:bg-primary/20",
  outline:
    "border border-card-border text-foreground hover:border-primary/40",
  ghost:
    "text-muted hover:text-foreground hover:bg-card",
} as const;

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-3.5 text-lg",
} as const;

interface ButtonProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const base = `inline-flex items-center justify-center rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={base}
    >
      {children}
    </button>
  );
}
