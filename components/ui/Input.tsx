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

export function Input({
  onValueChange,
  startContent: _startContent,
  labelPlacement: _labelPlacement,
  onChange,
  size,
  className,
  ...props
}: InputProps) {
  const handleChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    },
    [onChange, onValueChange],
  );

  return (
    <QuiInput
      size={size}
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
        className,
      )}
      {...props}
    />
  );
}
