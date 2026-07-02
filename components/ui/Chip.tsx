"use client";

import * as React from "react";
import { Badge } from "@qpub/qui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ChipColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type ChipVariant = "flat" | "bordered" | "solid" | "dot";
type ChipSize = "sm" | "md" | "lg";

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: ChipColor;
  variant?: ChipVariant;
  size?: ChipSize;
  isDisabled?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

const colorMap = {
  default: "default",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
  danger: "error",
} as const;

const dotColorMap: Record<string, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  default: "bg-default-400",
};

export function Chip({
  color = "default",
  variant = "flat",
  size = "md",
  isDisabled,
  onClose,
  children,
  className,
  ...props
}: ChipProps) {
  const badgeColor = colorMap[color] as "default" | "primary" | "secondary" | "success" | "warning" | "error";
  const badgeVariant = variant === "dot" ? "flat" : variant;

  return (
    <Badge
      color={badgeColor}
      variant={badgeVariant}
      size={size}
      className={cn(
        isDisabled && "pointer-events-none opacity-40",
        onClose && "pr-1",
        className,
      )}
      {...(props as Omit<React.ComponentProps<"span">, "color">)}
    >
      {variant === "dot" && (
        <span
          className={cn(
            "mr-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full",
            dotColorMap[badgeColor] ?? "bg-default-400",
          )}
        />
      )}
      {children}
      {onClose && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="ml-1 inline-flex items-center rounded-full opacity-70 hover:opacity-100 focus:outline-none"
          aria-label="Remove"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
