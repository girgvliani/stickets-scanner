import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// ─── BasePill ────────────────────────────────────────────────

interface BasePillProps {
  children: ReactNode;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  size?: "xs" | "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

const sizeClasses = {
  xs: "px-1.5 py-0.5 text-[10px] font-normal",
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

export function BasePill({
  children,
  className = "",
  backgroundColor,
  textColor,
  borderColor,
  size = "md",
  style = {},
}: BasePillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-full",
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor,
        color: textColor,
        borderColor,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── TagPill ─────────────────────────────────────────────────

type TagVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "primary"
  | "secondary";

interface TagPillProps {
  tag: string;
  variant?: TagVariant;
  size?: "xs" | "sm" | "md" | "lg";
  showDot?: boolean;
  className?: string;
}

const variantColors: Record<
  TagVariant,
  { bg: string; text: string; dot: string }
> = {
  default: { bg: "rgba(245, 245, 245, 0.125)", text: "#424242", dot: "#9E9E9E" },
  primary: { bg: "rgba(25, 118, 210, 0.125)", text: "#1976D2", dot: "#1976D2" },
  secondary: { bg: "rgba(123, 31, 162, 0.125)", text: "#7B1FA2", dot: "#7B1FA2" },
  success: { bg: "#E8F5E8", text: "#2E7D32", dot: "#4CAF50" },
  warning: { bg: "#FFF3E0", text: "#F57C00", dot: "#FF9800" },
  error: { bg: "#FEE2E2", text: "#D32F2F", dot: "#F44336" },
  info: { bg: "#DBEAFE", text: "#1565C0", dot: "#1976D2" },
};

export function TagPill({
  tag,
  variant = "default",
  size = "sm",
  showDot = false,
  className = "",
}: TagPillProps) {
  const colors = variantColors[variant];

  return (
    <BasePill
      backgroundColor={colors.bg}
      textColor={colors.text}
      size={size}
      className={className}
    >
      {showDot && (
        <div
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: colors.dot }}
        />
      )}
      <span>{tag}</span>
    </BasePill>
  );
}
