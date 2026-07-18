"use client";

import * as React from "react";
import { Button as QuiButton, Spinner } from "@qpub/qui";
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
  // bg-animated-default-face/-hover className — AnimatedButton's face color
  // must always win over this Button's own default-gray tokens, so it opts
  // out of this override rather than relying on tailwind-merge dedup.
  disableDefaultColorOverride?: boolean;
  // FE-1: @qpub/qui's Button has no native isLoading support (verified against
  // its compiled dist — no such prop, no spinner logic), despite the Design
  // System doc's Button States table documenting it as already supported for
  // Solid/Bordered. Implemented here instead, mirroring AnimatedButton.tsx's
  // existing isLoading pattern: disables the button and swaps children for a
  // spinner.
  isLoading?: boolean;
};

export function Button({
  size,
  className,
  disablePressTranslate,
  disableDefaultColorOverride,
  variant,
  color,
  isLoading,
  isDisabled,
  children,
  ...props
}: ButtonProps) {
  // @qpub/qui's default/md (no `size` prop, or explicit size="md") renders 36px
  // (h-9, or size-9 for icon-only buttons). The app wants that bumped to 40px
  // without touching sm (28px) or lg (48px) when explicitly requested. tailwind-merge
  // (via cn()) makes this win over qui's internal classes since it's appended last
  // inside qui's own Button implementation. Icon-only buttons need both dimensions
  // overridden (qui's icon-only sizing uses `size-9`, not a separate h-9/w-9 pair).
  const isDefaultOrMd = size === undefined || size === "md";
  // Icon-only md also needs padding forced to 0: qui's own `py-2` (from its md
  // size class) is never cancelled by its `size-9 px-0` icon-only classes, and
  // `has-[>svg]:px-3` outranks a plain `px-0` on specificity (the `:has()`
  // pseudo-class counts as an extra selector) — leaving 12px horizontal /
  // 8px vertical padding inside an otherwise-correctly-square 40x40 box. `!p-0`
  // forces both axes to 0, matching how sm/lg's own classes have no py at all.
  const sizeOverride = isDefaultOrMd
    ? ("isIconOnly" in props && props.isIconOnly ? "h-10 w-10 !p-0" : "h-10")
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
  // variant's default color with the dedicated --button-default-gray(-foreground) CSS variables instead
  // (app/globals.css, matching AnimatedButton's default face tones), substituted into each variant's own
  // real formula shape. The variable itself flips per theme, so no dark: prefix is needed anywhere below.
  // Bordered's hover shifts border/text to the hover value rather than filling the background, since a
  // solid fill this close in tone to the text color would wreck contrast. Flat keeps its original
  // opacity-based hover mechanic (only Solid/Bordered have a dedicated fixed hover value from the Fix
  // card). DS-10: Ghost now matches Bordered's own hover tint mechanic instead of filling solid — see
  // GHOST_NON_DEFAULT_OVERRIDE below for the non-default-color version of the same change.
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
          solid: "bg-button-default-gray text-button-default-gray-foreground hover:bg-button-default-gray/80",
          // DS-9: brought in line with the other five colors' Bordered hover
          // (DS-5/DS-8) — border/text stay unfaded on hover (same as rest),
          // background tint bumped from /5 to /20, both themes.
          bordered:
            "border-button-default-gray text-button-default-gray hover:bg-button-default-gray/20 hover:text-button-default-gray hover:border-button-default-gray",
          flat: "bg-button-default-gray/20 text-button-default-gray hover:bg-button-default-gray/15 hover:text-button-default-gray/80",
          ghost:
            "border-transparent text-button-default-gray hover:bg-button-default-gray/20 hover:text-button-default-gray",
        } as Record<string, string>)[effectiveVariant]
      : undefined;

  // Trial fix (Fix card "Ghost/Bordered Non-Default Text Contrast Too Low in
  // Light Mode"): Ghost's and Bordered's rest-state border+text for
  // non-default colors resolve straight to each color's semantic DEFAULT
  // (full-saturation brand oklch), which measures below WCAG AA against a
  // white background for several colors. Light-mode-only fix: pin rest-state
  // border+text to each color's step-700 numbered-scale hex instead (never
  // darker than 700, per a hard user constraint) — border and text always
  // match, never split. Trial only — do not mirror these values into the
  // Notion doc yet.
  //
  // DS-5/DS-6 hover follow-up: a plain `dark:border-{color} dark:text-{color}`
  // pair (no `:hover`) has the SAME CSS specificity as qui's native
  // `hover:text-{color}/80` or `hover:text-{color}-foreground` (one class +
  // one pseudo-class each), so with no explicit `dark:hover:` tie-breaker the
  // dark: rest-state re-assertion was ALSO winning on hover — Bordered's
  // dark-mode hover accidentally stopped fading (harmless), but Ghost's old
  // hover-fill text (pre-DS-10) collapsed onto the same color as its own fill
  // (invisible) without an explicit `dark:hover:` rule. DS-10 changed Ghost's
  // hover to a tint (see below) that relies on the SAME accidental-win
  // behavior Bordered already leans on, so neither variant carries a
  // `dark:hover:` rule below anymore.
  // Ghost (DS-10, Light Spec "Ghost Button — Remove Stroke, Switch Hover to
  // Tint-Only"): stroke retired entirely — border-transparent covers rest AND
  // hover (qui's ghost preset never emits a hover:border-* class for any
  // color, so nothing competes with this single unconditioned override).
  // Rest-state text keeps the same step-700/dark:{color} values the border
  // used to carry. Hover now reuses Bordered's own bg-{color}/20 tint plus an
  // explicit hover:text-{color}-700 restatement (unconditioned by dark:) to
  // defeat qui's native hover:text-{color}-foreground — mirroring
  // BORDERED_NON_DEFAULT_OVERRIDE's already-shipped pattern below, where
  // dark:text-{color} (rest) already reliably wins the same cascade tie
  // against a plain hover: rule, so no extra dark:hover: override is needed.
  // error keeps the same danger/error key split BORDERED_NON_DEFAULT_OVERRIDE
  // has: text tracks the "danger" numbered scale, hover bg tracks "error".
  const GHOST_NON_DEFAULT_OVERRIDE: Record<string, string> = {
    primary:
      "border-transparent text-primary-700 hover:bg-primary/20 hover:text-primary-700 dark:text-primary",
    secondary:
      "border-transparent text-secondary-700 hover:bg-secondary/20 hover:text-secondary-700 dark:text-secondary",
    warning:
      "border-transparent text-warning-700 hover:bg-warning/20 hover:text-warning-700 dark:text-warning",
    success:
      "border-transparent text-success-700 hover:bg-success/20 hover:text-success-700 dark:text-success",
    error:
      "border-transparent text-danger-700 hover:bg-error/20 hover:text-danger-700 dark:text-error",
  };
  // Bordered: qui's native hover faded border+text to /80 of the ORIGINAL
  // semantic DEFAULT (not step-700), undoing the readability fix on hover.
  // Pin hover border/text to the exact same step-700 hex as rest — i.e. no
  // change at all on hover. DS-8: the native `hover:bg-{color}/5` tint was too
  // subtle to register (especially in dark mode) — bumped to /20, matching
  // Flat's own rest-state tint strength (bg-{color}/20), already confirmed
  // visible in both themes. /20 is theme-aware (same token Flat already uses,
  // no fixed hex) and applies uniformly in both themes per this task's scope
  // — there's no competing dark:-scoped bg rule to tie against here, unlike
  // the border/text case. Dark mode's border/text hover currently renders
  // unfaded already (the same specificity accident described above for
  // Ghost), so no `dark:hover:border/text` override is added — adding one
  // would be the actual change to dark mode's current rendered behavior.
  const BORDERED_NON_DEFAULT_OVERRIDE: Record<string, string> = {
    primary: "border-primary-700 text-primary-700 hover:bg-primary/20 hover:border-primary-700 hover:text-primary-700 dark:border-primary dark:text-primary",
    secondary: "border-secondary-700 text-secondary-700 hover:bg-secondary/20 hover:border-secondary-700 hover:text-secondary-700 dark:border-secondary dark:text-secondary",
    warning: "border-warning-700 text-warning-700 hover:bg-warning/20 hover:border-warning-700 hover:text-warning-700 dark:border-warning dark:text-warning",
    success: "border-success-700 text-success-700 hover:bg-success/20 hover:border-success-700 hover:text-success-700 dark:border-success dark:text-success",
    error: "border-danger-700 text-danger-700 hover:bg-error/20 hover:border-danger-700 hover:text-danger-700 dark:border-error dark:text-error",
  };
  const nonDefaultContrastOverride =
    effectiveVariant === "ghost"
      ? GHOST_NON_DEFAULT_OVERRIDE[effectiveColor]
      : effectiveVariant === "bordered"
        ? BORDERED_NON_DEFAULT_OVERRIDE[effectiveColor]
        : undefined;

  return (
    <QuiButton
      size={size}
      variant={variant}
      color={color}
      isDisabled={isDisabled || isLoading}
      className={cn(
        sizeOverride,
        radiusOverride,
        pressOverride,
        defaultColorOverride,
        nonDefaultContrastOverride,
        className,
      )}
      {...(props as QuiButtonProps)}
    >
      {isLoading ? <Spinner size="sm" /> : children}
    </QuiButton>
  );
}
