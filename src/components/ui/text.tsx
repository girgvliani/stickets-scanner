import type { CSSProperties, ElementType, ReactNode } from "react";
import { typography } from "@/shared/design-token/typography";
import { cn } from "@/lib/cn";

type TextVariant =
  | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "h7" | "h8" | "h9"
  | "span" | "span2" | "span3" | "span4"
  | "p" | "p2" | "p3" | "p4"
  | "label" | "label2";

type TextSizeKey = keyof typeof typography.fontSize;
type TextWeightKey = keyof typeof typography.fontWeight;

interface TextProps {
  as?: ElementType;
  variant?: TextVariant;
  size?: TextSizeKey;
  weight?: TextWeightKey;
  color?: "primary" | "secondary" | "danger" | "white" | "default";
  className?: string;
  children?: ReactNode;
  htmlFor?: string;
  style?: CSSProperties;
}

type VariantDefaults = {
  size: TextSizeKey;
  weight: TextWeightKey;
  as: ElementType;
};

const variantDefaults: Record<TextVariant, VariantDefaults> = {
  h1: { size: "4xl", weight: "semibold", as: "h1" },
  h2: { size: "3xl", weight: "semibold", as: "h2" },
  h3: { size: "2xl", weight: "semibold", as: "h3" },
  h4: { size: "xl", weight: "semibold", as: "h4" },
  h5: { size: "lg", weight: "semibold", as: "h5" },
  h6: { size: "base", weight: "semibold", as: "h6" },
  h7: { size: "sm", weight: "semibold", as: "h6" },
  h8: { size: "xs", weight: "semibold", as: "h6" },
  h9: { size: "2xs", weight: "semibold", as: "h6" },
  span: { size: "base", weight: "medium", as: "span" },
  span2: { size: "sm", weight: "medium", as: "span" },
  span3: { size: "xs", weight: "medium", as: "span" },
  span4: { size: "2xs", weight: "medium", as: "span" },
  p: { size: "base", weight: "normal", as: "p" },
  p2: { size: "sm", weight: "normal", as: "p" },
  p3: { size: "xs", weight: "normal", as: "p" },
  p4: { size: "2xs", weight: "normal", as: "p" },
  label: { size: "xs", weight: "bold", as: "label" },
  label2: { size: "2xs", weight: "bold", as: "label" },
};

const colorMap = {
  primary: "text-primary",
  secondary: "text-text-secondary",
  danger: "text-danger",
  white: "text-white",
  default: "text-text-primary",
};

export function Text({
  as,
  variant = "p",
  size,
  weight,
  color = "default",
  className,
  children,
  htmlFor,
  style,
  ...props
}: TextProps) {
  const defaults = variantDefaults[variant];
  const Component = as || defaults.as;
  const resolvedSize = size || defaults.size;
  const resolvedWeight = weight || defaults.weight;

  return (
    <Component
      className={cn(colorMap[color], className)}
      htmlFor={htmlFor}
      style={{
        fontSize: typography.fontSize[resolvedSize],
        fontWeight: typography.fontWeight[resolvedWeight],
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Text;
