import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "ghost";
}

export function Button({
  loading,
  variant = "primary",
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.99]"
      : "bg-transparent text-ink hover:bg-black/5";

  return (
    <button {...props} disabled={disabled || loading} className={`${base} ${styles} ${className}`}>
      {loading ? "Please wait…" : children}
    </button>
  );
}
