"use client";

import * as React from "react";
import {
  SelectTrigger as QuiSelectTrigger,
  SelectContent as QuiSelectContent,
  SelectItem as QuiSelectItem,
} from "@qpub/qui";
import { cn } from "@/lib/utils";

type QuiSelectTriggerProps = React.ComponentProps<typeof QuiSelectTrigger>;
type QuiSelectContentProps = React.ComponentProps<typeof QuiSelectContent>;
type QuiSelectItemProps = React.ComponentProps<typeof QuiSelectItem>;

export function SelectTrigger({ size, className, ...props }: QuiSelectTriggerProps) {
  // Mirrors components/ui/Input.tsx exactly. Border-radius is pinned to
  // rounded-medium (12px) regardless of size — qui's own SelectTrigger hardcodes
  // rounded-xs at every size, which doesn't match Input/AnimatedButton/Chip's real
  // radius token. The `!` important modifier forces rounded-medium to actually win
  // (tailwind-merge doesn't recognize this app's custom radius keys as conflicting
  // with qui's built-in xs/sm/md suffixes, so a plain override class isn't enough).
  // Height: default/md (no `size` prop, or explicit size="md") renders qui's
  // native 36px (h-9); bumped to 40px (h-10). `lg` renders qui's native 48px
  // (h-12); bumped to 56px (h-14) to match Input's lg exactly. `sm` (28px) is
  // untouched — not exposed/used anywhere in the app today, same as Input.
  return (
    <QuiSelectTrigger
      size={size}
      className={cn(
        "!rounded-medium",
        (size === undefined || size === "md") && "h-10",
        size === "lg" && "h-14",
        className,
      )}
      {...props}
    />
  );
}

interface SelectContentProps extends QuiSelectContentProps {
  // Not read from Radix context — qui's Select only clones `size` onto
  // SelectTrigger (see qui's Select() implementation), so SelectContent/SelectItem
  // never learn the trigger's size on their own. Callers pairing this with a
  // `size="lg"` SelectTrigger must pass the same `size` here too.
  size?: "sm" | "md" | "lg";
}

export function SelectContent({ className, ...props }: SelectContentProps) {
  // qui's SelectContent hardcodes rounded-xs (6px) with no size awareness at all,
  // which doesn't match this app's SelectTrigger (rounded-medium, 12px, above) —
  // opening any Select showed a dropdown whose corners visibly didn't match its
  // own trigger. Pin it to rounded-medium the same way, with the same `!`
  // important modifier for the same tailwind-merge reason.
  return <QuiSelectContent className={cn("!rounded-medium", className)} {...props} />;
}

interface SelectItemProps extends QuiSelectItemProps {
  size?: "sm" | "md" | "lg";
}

export function SelectItem({ size, className, ...props }: SelectItemProps) {
  // qui's SelectItem always renders at rounded-sm/text-sm regardless of the
  // trigger's size, so an `lg` (56px, text-base) trigger opened a dropdown whose
  // menu items still looked like the small/default size — a real size-sync gap.
  // Pin radius to rounded-medium for consistency with the trigger/content, and
  // bump text/padding to match `lg` when the caller tells us this item belongs to
  // an `lg` trigger (see SelectContentProps comment — there's no automatic way to
  // know this otherwise). Default/md is qui's native text-sm, unchanged.
  return (
    <QuiSelectItem
      className={cn("!rounded-medium", size === "lg" && "py-2 text-base", className)}
      {...props}
    />
  );
}
