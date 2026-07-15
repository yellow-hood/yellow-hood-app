"use client";

import * as React from "react";
import { Spinner } from "@qpub/qui";
import { Button } from "@/components/ui/Button";
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

// Dedicated to AnimatedButton only — decoupled from the numbered color scale
// (whose per-step hex values are theme-mirrored) so face/wall contrast can't
// invert if the scale's wiring changes. See --animated-*-face/-wall in globals.css.
const wallColor: Record<AnimatedButtonColor, string> = {
  primary: "bg-animated-primary-wall",
  secondary: "bg-animated-secondary-wall",
  default: "bg-animated-default-wall",
};

const faceColor: Record<AnimatedButtonColor, string> = {
  primary: "bg-animated-primary-face",
  secondary: "bg-animated-secondary-face",
  default: "bg-animated-default-face",
};

const faceHoverColor: Record<AnimatedButtonColor, string> = {
  primary: "hover:bg-animated-primary-face-hover",
  secondary: "hover:bg-animated-secondary-face-hover",
  default: "hover:bg-animated-default-face-hover",
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
        className,
      )}
    >
      {/* static wall layer, riser is 8px (corrected per Design System doc) */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 top-2 rounded-large",
          wallColor[color],
        )}
      />
      {/* button face */}
      <Button
        type={type as "button" | "submit" | "reset"}
        {...props}
        color={color}
        size={size === "xl" ? "lg" : "md"}
        isDisabled={!!disabled}
        disablePressTranslate
        disableDefaultColorOverride
        onPointerDown={() => { if (!disabled) setPressed(true); }}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        className={cn(
          // Explicit height (8px shorter than the container) instead of the flex
          // default stretch-to-fill: this is what leaves the wall layer's bottom
          // 8px strip visible at rest (lg: 48px container -> 40px face; xl: 56px
          // container -> 48px face). Pressing translates the face down by that
          // same 8px so it sits flush with the wall, per the two-layer press spec.
          "relative z-10 flex h-[calc(100%-8px)] w-full items-center justify-center gap-2 rounded-large font-semibold",
          size === "xl" ? "px-8 text-base" : "px-6 text-sm",
          faceColor[color],
          color === "default" && "text-foreground",

          // Qui's Button overrides to cancel visual conflicts with the wall/press illusion
          faceHoverColor[color],
          "motion-safe:active:scale-100",
          "disabled:opacity-100",
          
          pressed && !disabled ? "translate-y-2" : "translate-y-0",
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
      </Button>
    </div>
  );
}