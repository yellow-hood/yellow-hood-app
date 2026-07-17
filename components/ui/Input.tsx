"use client";

import * as React from "react";
import { Input as QuiInput } from "@qpub/qui";
import { cn } from "@/lib/utils";

type QuiInputProps = React.ComponentProps<typeof QuiInput>;

interface InputProps extends Omit<QuiInputProps, "onChange"> {
  onValueChange?: (value: string) => void;
  startContent?: React.ReactNode; // accepted but not rendered (decorative icons not in @qpub/qui Input)
  labelPlacement?: string; // accepted and ignored — @qpub/qui always renders label above input
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

// Design System doc's per-state Input color table. isInvalid takes priority
// over the warning/success color prop, matching qui's own effectiveColor
// precedence inside its compiled Input. Idle/hover border reuses the same
// default-200/700 and default-400/500 steps OtpInput.tsx already uses; every
// other state lands on that scale's "-500" step, the documented pivot value
// identical in light and dark (no dark: prefix needed there). The Error
// state uses `danger-500` (numbered scale), not `error-500` — the pink/red
// family's numbered steps are keyed "danger" in tailwind.config.ts; qui's own
// "error" preset key only has DEFAULT/foreground, no numbered steps, so
// `border-error-500`/`text-error-500` silently produce no CSS at all. Label
// color is driven by the same state — qui's native Input has no styling hook
// for its built-in label (it hardcodes "flex gap-1 mb-2" internally with no
// classNames prop), so the label is rendered here instead and qui's own is
// suppressed by never passing `label` down to it.
const LABEL_COLOR: Record<"idle" | "warning" | "error" | "success", string> = {
  idle: "text-default-600",
  warning: "text-warning-500",
  error: "text-danger-500",
  success: "text-success-500",
};

export function Input({
  onValueChange,
  startContent: _startContent,
  labelPlacement: _labelPlacement,
  onChange,
  size,
  className,
  label,
  color,
  isInvalid,
  id,
  dir,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id ?? (label ? generatedId : undefined);

  // Input Typography spec: font-family switches automatically off `dir` —
  // IRANSansXV (with its required 'dots' 8 variation axis, already baked
  // into the existing `.font-fa` utility in globals.css) for rtl, Nunito
  // for ltr/default. Applies to both the input content and the (static)
  // label, so no manual font-[IRANSansXV] override is ever needed at call
  // sites.
  const fontClass = dir === "rtl" ? "font-fa" : "font-nunito";

  const handleChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    },
    [onChange, onValueChange],
  );

  const state: "idle" | "warning" | "error" | "success" = isInvalid
    ? "error"
    : color === "warning"
      ? "warning"
      : color === "success"
        ? "success"
        : "idle";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn("text-sm font-medium", LABEL_COLOR[state], fontClass)}
        >
          {label}
        </label>
      )}
      <QuiInput
        id={inputId}
        size={size}
        color={color}
        isInvalid={isInvalid}
        dir={dir}
        onChange={handleChange}
        // Border-radius is pinned to rounded-medium (12px) regardless of size — qui's
        // own size variant otherwise scales radius down (rounded-xs) at every size,
        // which doesn't match the app's real radius token used elsewhere (see
        // components/ui/OtpInput.tsx, components/ui/AnimatedButton.tsx). tailwind-merge
        // doesn't recognize this app's custom radius keys (medium/small/large) as
        // conflicting with qui's built-in xs/sm/md suffixes, so a plain override
        // class is left in the DOM alongside qui's own rounded-xs with no guaranteed
        // winner — the `!` important modifier forces rounded-medium to actually win.
        // `lg` also gets an explicit 56px height override (h-14, via tailwind-merge,
        // which DOES correctly dedupe against qui's internal h-12) — matching
        // AnimatedButton's mobile-only `xl` height, since Input `lg` and AnimatedButton
        // `xl` are the app's two large touch-target mobile controls and should be
        // visually consistent with each other (not with OtpInput specifically).
        // The default (no `size` prop, which every existing usage in the app relies
        // on) and the equivalent explicit `size="md"` get bumped from qui's native
        // 36px to 40px (h-10) the same way. `sm` (28px) is untouched — it's not
        // exposed or used anywhere in the app today.
        className={cn(
          "!rounded-medium",
          (size === undefined || size === "md") && "h-10",
          size === "lg" && "h-14",
          // Same `!` important-override reasoning as radius above — qui's own
          // compound-variant border/background classes need a guaranteed win.
          "!border-default-200 dark:!border-default-700 !bg-muted/5",
          "hover:!border-default-400 dark:hover:!border-default-500",
          "focus:!border-primary-500",
          // FA/RTL dark-mode focus override: border turns white instead of
          // primary yellow. Label color is untouched — border only. Tailwind's
          // built-in `rtl:` variant matches the nearest ancestor `dir="rtl"`,
          // so this activates whenever a caller passes `dir="rtl"` (flows
          // through via the ...props spread below onto the native input).
          "dark:rtl:focus:!border-white",
          state === "warning" && "!border-warning-500 !bg-warning/5",
          state === "success" && "!border-success-500 !bg-success/5",
          // qui's compiled Input can leave both its bg-error/5 compound-variant
          // class and its own isInvalid-appended bg-error/10 in the DOM with no
          // guaranteed winner — force the doc's double-opacity value explicitly.
          state === "error" && "!border-danger-500 !bg-error/10",
          fontClass,
          className,
        )}
        {...props}
      />
    </div>
  );
}
