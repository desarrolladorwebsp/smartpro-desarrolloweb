import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonLinkVariant = "primary" | "secondary" | "ghost" | "onDark";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonLinkVariant;
  className?: string;
  external?: boolean;
};

const VARIANTS = {
  primary:
    "bg-sp-gradient-button text-sp-white shadow-sp-soft hover:brightness-105 focus-visible:ring-sp-violet",
  secondary:
    "border border-sp-line bg-sp-white text-sp-ink hover:border-sp-violet/40 hover:bg-sp-surface focus-visible:ring-sp-violet",
  ghost:
    "bg-transparent text-sp-ink hover:bg-sp-surface focus-visible:ring-sp-violet",
  onDark:
    "border border-sp-white/20 bg-sp-white text-sp-ink hover:bg-sp-surface focus-visible:ring-sp-white",
} as const;

export function buttonLinkClassName(variant: ButtonLinkVariant = "primary", className = "") {
  return `inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-sm font-bold transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${className}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: ButtonLinkProps) {
  const classes = buttonLinkClassName(variant, className);

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
