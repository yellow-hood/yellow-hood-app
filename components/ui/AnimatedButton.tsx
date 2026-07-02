"use client";

import * as React from "react";
import { Spinner } from "@qpub/qui";
import { cn } from "@/lib/utils";

type AnimatedButtonColor = "primary" | "secondary" | "default";
type AnimatedButtonSize = "lg" | "xl";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: AnimatedButtonColor;
  size?: AnimatedButtonSize;
  isDisabled?: boolean;
  isLoading?: boolean;
  startContent?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const wallColor: Record<AnimatedButtonColor, string> = {
  primary: "bg-primary-800",
  secondary: "bg-secondary-800",
  default: "bg-default-500 dark:bg-default-600",
};

const faceColor: Record<AnimatedButtonColor, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  default: "bg-default-200 text-foreground dark:bg-default-700",
};

export function AnimatedButton({
  color = "primary",
  size = "lg",
  isDisabled,
  isLoading,
  startContent,
  fullWidth,
  className,
  children,
  type = "button",
  ...props
}: AnimatedButtonProps) {
  const [pressed, setPressed] = React.useState(false);
  const disabled = isDisabled || isLoading;

  return (
    <div
      className={cn(
        "relative inline-flex select-none",
        size === "xl" ? "h-14" : "h-12",
        fullWidth && "w-full",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {/* static wall layer, always translated down by 4px */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 top-1 rounded-medium",
          wallColor[color],
        )}
      />
      {/* button face */}
      <button
        type={type as "button" | "submit" | "reset"}
        {...props}
        disabled={!!disabled}
        onPointerDown={() => { if (!disabled) setPressed(true); }}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        className={cn(
          "relative z-10 flex w-full items-center justify-center gap-2 rounded-medium font-semibold",
          size === "xl" ? "text-base px-8" : "text-sm px-6",
          faceColor[color],
          pressed && !disabled ? "translate-y-1" : "translate-y-0",
          className,
        )}
        style={{
          transitionProperty: "transform",
          transitionDuration: pressed ? "80ms" : "120ms",
          transitionTimingFunction: pressed ? "ease-out" : "ease-in",
        }}
      >
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <>
            {startContent}
            {children}
          </>
        )}
      </button>
    </div>
  );
}
