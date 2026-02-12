import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, FC } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "rounded-xl border border-border bg-white px-4 py-3 text-base text-text-primary outline-none transition-colors placeholder:text-text-secondary/50 focus:border-primary",
            error && "border-danger",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-sm text-danger">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
