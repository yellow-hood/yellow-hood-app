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

// qui's Badge color="default" resolves inside the compiled @qpub/qui bundle to --foreground/--background
// (Solid: bg-foreground text-background; Bordered: border-foreground text-foreground on qui's own
// bg-background; Flat: bg-foreground/10 text-foreground — confirmed distinct from Button's Flat, which
// uses bg-muted/20) — the page's primary text/background color, not a neutral gray. Same root cause as
// Button (see components/ui/Button.tsx), same dedicated --button-default-gray(-foreground) CSS variables
// (app/globals.css) used as the fix — the var itself flips per theme, so no dark: prefix is needed below.
// "dot" isn't a real qui Badge variant — Chip renders it as a Flat badge (see badgeVariant below) plus a
// separately-colored indicator dot, so it's covered by the Flat entry here for the pill itself; the dot's
// own color is fixed separately in dotColorMap below.
// Hover mechanism matches Badge's real per-color formula (verified against primary's compiled classes)
// rather than a discrete fixed hover hex: Solid dims the background to 80% opacity; Bordered only
// faintly tints the background (5%) with no text/border fade — Badge's real Bordered mechanism never
// fades text/border on hover, confirmed different from Button's Bordered. Flat already matched Badge's
// real mechanism (bg/15, no text fade) and is unchanged.
const defaultColorOverride: Record<string, string> = {
  solid: "bg-button-default-gray text-button-default-gray-foreground hover:bg-button-default-gray/80",
  bordered: "border-button-default-gray text-button-default-gray hover:bg-button-default-gray/5",
  flat: "bg-button-default-gray/10 text-button-default-gray hover:bg-button-default-gray/15",
};

// Trial fix (Fix card "Ghost/Bordered Non-Default Text Contrast Too Low in
// Light Mode"): same bug as Button.tsx's Ghost/Bordered had — Chip's Bordered
// variant resolves non-default colors' rest-state border+text straight to
// each color's semantic DEFAULT (qui's `border-{color} text-{color}`
// compound class), which is low contrast against white in light mode. Same
// fix, same step-700 values as Button.tsx's GHOST_NON_DEFAULT_OVERRIDE /
// BORDERED_NON_DEFAULT_OVERRIDE (never darker than 700, per a hard user
// constraint) — now referencing each color's existing step-700 numbered-scale
// class instead of a duplicated hex literal. The pink/red family's numbered
// scale is keyed "danger" (tailwind.config.ts), not "error" — qui's own
// "error" preset key only has DEFAULT/foreground, no numbered steps
// (confirmed against node_modules/@qpub/qui/dist/tailwind-preset.mjs). The
// dark: pair re-asserts qui's own theme-aware classes so dark mode (already
// fine) is unaffected. Hover (`[a&]:hover:bg-{color}/5`) is untouched.
const nonDefaultContrastOverride: Record<string, string> = {
  primary: "border-primary-700 text-primary-700 dark:border-primary dark:text-primary",
  secondary: "border-secondary-700 text-secondary-700 dark:border-secondary dark:text-secondary",
  warning: "border-warning-700 text-warning-700 dark:border-warning dark:text-warning",
  success: "border-success-700 text-success-700 dark:border-success dark:text-success",
  error: "border-danger-700 text-danger-700 dark:border-error dark:text-error",
};

const dotColorMap: Record<string, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  // Not bound to --foreground/--background like the rest of this map's siblings' formulas — this was
  // always a static, theme-invariant numbered-scale gray (bg-default-400, #A1A1AA in both themes), so it
  // never had the near-black/near-white bug. Updated to the same --button-default-gray token as
  // Solid/Bordered/Flat above purely for visual consistency across the default-color family.
  default: "bg-button-default-gray",
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
        // Border-radius is pinned to rounded-medium (12px) regardless of size —
        // qui's own Badge renders rounded-md (6px) with no doc-matching token.
        // The `!` important modifier forces this to win for the same reason as
        // components/ui/Input.tsx and components/ui/Select.tsx: tailwind-merge
        // doesn't recognize this app's custom radius keys as conflicting with
        // qui's built-in radius suffixes.
        "!rounded-medium",
        color === "default" && defaultColorOverride[badgeVariant],
        badgeVariant === "bordered" && badgeColor !== "default" && nonDefaultContrastOverride[badgeColor],
        isDisabled && "pointer-events-none opacity-40",
        onClose && "pr-1",
        className,
      )}
      {...(props as Omit<React.ComponentProps<"span">, "color">)}
    >
      {variant === "dot" && (
        // DS-10: tailwind.config.ts's custom `theme.spacing` scale is
        // whole-number-only (no "1.5"/"0.5" steps), so `h-1.5 w-1.5 mr-1.5`
        // resolved to nothing at all — the marker rendered as an invisible
        // 0x0 box, leaving a phantom gap-1 before the text with no visible
        // dot to justify it. Arbitrary-value classes bypass the theme scale
        // entirely; 6px is the same size Tailwind's own default "1.5" step
        // would have produced (0.375rem), not a new/invented value.
        <span
          className={cn(
            "mr-[6px] inline-block h-[6px] w-[6px] flex-shrink-0 rounded-full",
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
