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
// Button (see components/ui/Button.tsx), same fixed Button-scoped gray pair as the fix: light #52525B /
// dark #E4E4E7. "dot" isn't a real qui Badge variant — Chip renders it as a Flat badge (see badgeVariant
// below) plus a separately-colored indicator dot, so it's covered by the Flat entry here for the pill
// itself; the dot's own color is fixed separately in dotColorMap below.
// Hover mechanism matches Badge's real per-color formula (verified against primary's compiled classes)
// rather than a discrete fixed hover hex: Solid dims the background to 80% opacity; Bordered only
// faintly tints the background (5%) with no text/border fade — Badge's real Bordered mechanism never
// fades text/border on hover, confirmed different from Button's Bordered. Flat already matched Badge's
// real mechanism (bg/15, no text fade) and is unchanged.
const defaultColorOverride: Record<string, string> = {
  solid: "bg-[#52525B] text-white hover:bg-[#52525B]/80 dark:bg-[#E4E4E7] dark:text-[#18181B] dark:hover:bg-[#E4E4E7]/80",
  bordered:
    "border-[#52525B] text-[#52525B] hover:bg-[#52525B]/5 dark:border-[#E4E4E7] dark:text-[#E4E4E7] dark:hover:bg-[#E4E4E7]/5",
  flat: "bg-[#52525B]/10 text-[#52525B] hover:bg-[#52525B]/15 dark:bg-[#E4E4E7]/10 dark:text-[#E4E4E7] dark:hover:bg-[#E4E4E7]/15",
};

const dotColorMap: Record<string, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  // Not bound to --foreground/--background like the rest of this map's siblings' formulas — this was
  // always a static, theme-invariant numbered-scale gray (bg-default-400, #A1A1AA in both themes), so it
  // never had the near-black/near-white bug. Updated to the same fixed pair as Solid/Bordered/Flat above
  // purely for visual consistency across the default-color family.
  default: "bg-[#52525B] dark:bg-[#E4E4E7]",
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
