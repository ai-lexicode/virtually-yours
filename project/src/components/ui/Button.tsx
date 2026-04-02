import Link from "next/link";

const variants = {
  primary:
    "btn-gradient font-semibold",
  secondary:
    "bg-surface-container-lowest text-secondary font-semibold hover:bg-surface-container-low",
  outline:
    "bg-transparent text-secondary font-semibold hover:bg-surface-container",
  ghost:
    "text-muted hover:text-foreground hover:underline",
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
  const base = `inline-flex items-center justify-center rounded-[0.25rem] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

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
