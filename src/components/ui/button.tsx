import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-primary text-white hover:bg-primary-hover active:bg-primary-hover",
        variant === "secondary" &&
          "bg-background-light text-text-primary hover:bg-border active:bg-border",
        variant === "ghost" &&
          "bg-transparent text-text-secondary hover:bg-background-light",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
