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
          // DS-9: brought in line with the other five colors' Bordered hover
          // (DS-5/DS-8) — border/text stay unfaded on hover (same as rest),
          // background tint bumped from /5 to /20, both themes. No
          // specificity-tie risk here (unlike the non-default colors): this
          // whole string is fixed hex with explicit dark: pairs already, not
          // a theme-aware CSS var class.
          bordered:
            "border-[#52525B] text-[#52525B] hover:bg-[#52525B]/20 hover:text-[#52525B] hover:border-[#52525B] dark:border-[#E4E4E7] dark:text-[#E4E4E7] dark:hover:bg-[#E4E4E7]/20 dark:hover:text-[#E4E4E7] dark:hover:border-[#E4E4E7]",
          flat: "bg-[#52525B]/20 text-[#52525B] hover:bg-[#52525B]/15 hover:text-[#52525B]/80 dark:bg-[#E4E4E7]/20 dark:text-[#E4E4E7] dark:hover:bg-[#E4E4E7]/15 dark:hover:text-[#E4E4E7]/80",
          ghost:
            "border-[#52525B] text-[#52525B] hover:bg-[#52525B] hover:text-white dark:border-[#E4E4E7] dark:text-[#E4E4E7] dark:hover:bg-[#E4E4E7] dark:hover:text-[#18181B]",
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
  // dark-mode hover accidentally stopped fading (harmless), but Ghost's
  // dark-mode hover text collapsed onto the same color as its own fill
  // (invisible). Every variant below now carries an explicit `dark:hover:`
  // rule so dark mode's hover is spelled out rather than left to a
  // specificity coincidence.
  const GHOST_NON_DEFAULT_OVERRIDE: Record<string, string> = {
    // Ghost hover (DS-7, supersedes DS-6's step-700 fill): user reviewed DS-6's
    // step-700 hover fill running and found it too dark/muted — hover should
    // look exactly like the Solid variant instead. bg-{color}/border-{color}/
    // text-{color}-foreground are the exact classes Solid itself uses, and are
    // already theme-aware via their own CSS vars, so hover reads identically
    // to Solid in both themes with no fixed hex needed here. text-{color}
    // -foreground (not a hardcoded pairing) is deliberate: --warning-foreground
    // and --success-foreground flip between light (white) and dark (#18181B)
    // per app/globals.css and the Notion doc's own Foreground columns, so
    // reusing the semantic token is what keeps hover pixel-identical to Solid
    // in both themes — a fixed mapping would only match dark mode.
    // dark:hover:* re-asserts the same values explicitly: dark:text-{color}
    // (kept below for the REST state) shares CSS specificity with a plain
    // hover:text-{color}-foreground, so without an explicit dark:hover: rule
    // the rest-state rule can silently win on hover in dark mode (this is
    // exactly what made DS-6's hover text briefly go invisible in dark mode).
    primary:
      "border-[#C97106] text-[#C97106] hover:bg-primary hover:border-primary hover:text-primary-foreground dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:border-primary dark:hover:text-primary-foreground",
    secondary:
      "border-[#A64DCC] text-[#A64DCC] hover:bg-secondary hover:border-secondary hover:text-secondary-foreground dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:border-secondary dark:hover:text-secondary-foreground",
    warning:
      "border-[#CC5B29] text-[#CC5B29] hover:bg-warning hover:border-warning hover:text-warning-foreground dark:border-warning dark:text-warning dark:hover:bg-warning dark:hover:border-warning dark:hover:text-warning-foreground",
    success:
      "border-[#0E793C] text-[#0E793C] hover:bg-success hover:border-success hover:text-success-foreground dark:border-success dark:text-success dark:hover:bg-success dark:hover:border-success dark:hover:text-success-foreground",
    error:
      "border-[#920B3A] text-[#920B3A] hover:bg-error hover:border-error hover:text-error-foreground dark:border-error dark:text-error dark:hover:bg-error dark:hover:border-error dark:hover:text-error-foreground",
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
    primary: "border-[#C97106] text-[#C97106] hover:bg-primary/20 hover:border-[#C97106] hover:text-[#C97106] dark:border-primary dark:text-primary",
    secondary: "border-[#A64DCC] text-[#A64DCC] hover:bg-secondary/20 hover:border-[#A64DCC] hover:text-[#A64DCC] dark:border-secondary dark:text-secondary",
    warning: "border-[#CC5B29] text-[#CC5B29] hover:bg-warning/20 hover:border-[#CC5B29] hover:text-[#CC5B29] dark:border-warning dark:text-warning",
    success: "border-[#0E793C] text-[#0E793C] hover:bg-success/20 hover:border-[#0E793C] hover:text-[#0E793C] dark:border-success dark:text-success",
    error: "border-[#920B3A] text-[#920B3A] hover:bg-error/20 hover:border-[#920B3A] hover:text-[#920B3A] dark:border-error dark:text-error",
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
      className={cn(
        sizeOverride,
        radiusOverride,
        pressOverride,
        defaultColorOverride,
        nonDefaultContrastOverride,
        className,
      )}
      {...(props as QuiButtonProps)}
    />
  );
}
