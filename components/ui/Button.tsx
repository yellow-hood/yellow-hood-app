"use client";

import * as React from "react";
import { Button as QuiButton } from "@qpub/qui";
import { cn } from "@/lib/utils";

type QuiButtonProps = React.ComponentProps<typeof QuiButton>;

type ButtonProps = QuiButtonProps & {
  // Internal-only escape hatch, not part of the public API: skips this
  // wrapper's default press-translate/scale override entirely, leaving the
  // caller's own press styling uncontested (used by AnimatedButton).
  disablePressTranslate?: boolean;
  // Internal-only escape hatch, not part of the public API: skips the
  // color="default" override below entirely. Needed by AnimatedButton, which
  // renders its face through this Button with its own dedicated
  // bg-animated-default-face/-hover className. tailwind-merge only dedupes
  // classes that share the exact same modifier stack — it correctly drops our
  // unprefixed bg-[#52525B]/text-white/hover:bg-[#4C4C54] in favor of
  // AnimatedButton's unprefixed classes (last-wins), but our dark:-prefixed
  // classes (dark:bg-[#E4E4E7] etc.) have no unprefixed-vs-dark: counterpart
  // to dedupe against in AnimatedButton's className, since --animated-default-face
  // is a single CSS variable that already flips per theme. Both survive, and
  // the dark:-prefixed rule (specificity 2, via ".dark &") always beats
  // AnimatedButton's unprefixed, CSS-variable-driven class (specificity 1) once
  // .dark is active — no reordering of cn() args can fix that, since it's a
  // specificity mismatch, not a merge/ordering bug. Skipping the override
  // entirely for AnimatedButton is the only reliable fix.
  disableDefaultColorOverride?: boolean;
};

export function Button({
  size,
  className,
  disablePressTranslate,
  disableDefaultColorOverride,
  variant,
  color,
  ...props
}: ButtonProps) {
  // @qpub/qui's default/md (no `size` prop, or explicit size="md") renders 36px
  // (h-9, or size-9 for icon-only buttons). The app wants that bumped to 40px
  // without touching sm (28px) or lg (48px) when explicitly requested. tailwind-merge
  // (via cn()) makes this win over qui's internal classes since it's appended last
  // inside qui's own Button implementation. Icon-only buttons need both dimensions
  // overridden (qui's icon-only sizing uses `size-9`, not a separate h-9/w-9 pair).
  const isDefaultOrMd = size === undefined || size === "md";
  const sizeOverride = isDefaultOrMd
    ? ("isIconOnly" in props && props.isIconOnly ? "h-10 w-10" : "h-10")
    : undefined;

  // Border-radius is pinned per size to the Design System doc's Button Sizes
  // table (sm -> 12px, md/lg -> 14px) — qui's own size variant otherwise
  // renders rounded-sm/rounded-md/rounded-lg (2px/6px/8px), which doesn't match.
  // tailwind-merge doesn't recognize this app's custom radius keys (medium/large)
  // as conflicting with qui's built-in radius suffixes, so a plain override class
  // is left in the DOM alongside qui's own with no guaranteed winner — the `!`
  // important modifier forces the override to actually win (same pattern as
  // components/ui/Input.tsx and components/ui/Select.tsx).
  const radiusOverride = size === "sm" ? "!rounded-medium" : "!rounded-large";

  // Replaces qui's default motion-safe:active:scale-[0.98] press feedback
  // with a translateY(2px) shift of equivalent subtle intensity. scale-100
  // is required alongside translate-y-[2px] to actually cancel qui's scale
  // class — scale and translate are separate Tailwind transform utility
  // groups, so tailwind-merge won't dedupe one against the other and both
  // would otherwise apply together.
  const pressOverride = disablePressTranslate
    ? undefined
    : "motion-safe:active:translate-y-[2px] motion-safe:active:scale-100";

  // color="default" resolves inside @qpub/qui's compiled bundle to --foreground/--background
  // (Solid: bg-foreground text-background; Bordered: border-foreground bg-background text-foreground;
  // Flat: bg-muted/20 text-foreground; Ghost: border-foreground bg-background text-foreground, hover
  // fills bg-foreground text-background) — the page's primary text/background color, not a neutral gray,
  // and not editable in place since those vars are shared with all body text. This overrides each
  // variant's default color with a fixed, Button-scoped gray pair instead (light #52525B / dark #E4E4E7),
  // matching AnimatedButton's default face tones, substituted into each variant's own real formula shape.
  // Bordered's hover shifts border/text to the hover hex rather than filling the background, since a
  // solid fill this close in tone to the text color would wreck contrast. Flat keeps its original
  // opacity-based hover mechanic (only Solid/Bordered/Ghost have a dedicated fixed hover value from the
  // Fix card). Ghost's hover-fill text companion follows Solid's white/#18181B pairing.
  const effectiveVariant = variant ?? "solid";
  const effectiveColor = color ?? "default";
  const defaultColorOverride =
    !disableDefaultColorOverride && effectiveColor === "default"
      ? ({
          // Hover mechanism matches qui's real per-color formula (verified against primary's compiled
          // classes in the @qpub/qui bundle) rather than a discrete fixed hover hex: Solid dims the
          // background to 80% opacity; Bordered only faintly tints the background (5%) and fades
          // text/border to 80%; Flat bumps the background tint to 15% and fades text to 80% (matching
          // every other color's real Flat strength, not Default's own original 10%/muted-based value).
          solid: "bg-[#52525B] text-white hover:bg-[#52525B]/80 dark:bg-[#E4E4E7] dark:text-[#18181B] dark:hover:bg-[#E4E4E7]/80",
          bordered:
            "border-[#52525B] text-[#52525B] hover:bg-[#52525B]/5 hover:text-[#52525B]/80 hover:border-[#52525B]/80 dark:border-[#E4E4E7] dark:text-[#E4E4E7] dark:hover:bg-[#E4E4E7]/5 dark:hover:text-[#E4E4E7]/80 dark:hover:border-[#E4E4E7]/80",
          flat: "bg-[#52525B]/20 text-[#52525B] hover:bg-[#52525B]/15 hover:text-[#52525B]/80 dark:bg-[#E4E4E7]/20 dark:text-[#E4E4E7] dark:hover:bg-[#E4E4E7]/15 dark:hover:text-[#E4E4E7]/80",
          ghost:
            "border-[#52525B] text-[#52525B] hover:bg-[#52525B] hover:text-white dark:border-[#E4E4E7] dark:text-[#E4E4E7] dark:hover:bg-[#E4E4E7] dark:hover:text-[#18181B]",
        } as Record<string, string>)[effectiveVariant]
      : undefined;

  return (
    <QuiButton
      size={size}
      variant={variant}
      color={color}
      className={cn(sizeOverride, radiusOverride, pressOverride, defaultColorOverride, className)}
      {...(props as QuiButtonProps)}
    />
  );
}
