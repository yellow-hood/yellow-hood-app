"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type OtpInputSize = "sm" | "lg";

interface OtpInputProps {
  onComplete?: (otp: string) => void;
  className?: string;
  size?: OtpInputSize;
}

// Heights are pinned to match components/ui/Input.tsx exactly: sm = 40px (h-10,
// same as Input's default/md) and lg = 56px (h-14, same as Input's lg and
// AnimatedButton's mobile xl) — width is independent and just the component's
// own proportional cell width, not tied to Input. lg remains the default so no
// caller relying on the untyped behavior changes without an explicit opt-in.
const CELL_SIZE_CLASS: Record<OtpInputSize, string> = {
  sm: "h-10 w-10",
  lg: "h-14 w-12",
};

export function OtpInput({ onComplete, className, size = "lg" }: OtpInputProps) {
  const [values, setValues] = React.useState(["", "", "", ""]);
  const refs = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/[^0-9a-zA-Z]/g, "").slice(-1);
    const next = [...values];
    next[index] = char;
    setValues(next);

    if (char && index < 3) {
      refs[index + 1].current?.focus();
    }

    if (next.every((v) => v !== "")) {
      onComplete?.(next.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (values[index]) {
        const next = [...values];
        next[index] = "";
        setValues(next);
      } else if (index > 0) {
        refs[index - 1].current?.focus();
        const next = [...values];
        next[index - 1] = "";
        setValues(next);
      }
    }
  };

  return (
    <div className={cn("flex gap-3", className)}>
      {refs.map((ref, i) => (
        <input
          key={i}
          ref={ref}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[i]}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={cn(
            "rounded-medium border text-center text-xl font-semibold outline-none transition-colors shrink-0",
            CELL_SIZE_CLASS[size],
            "border-default-200 dark:border-default-700 bg-muted/5 text-foreground",
            "hover:border-default-400 dark:hover:border-default-500",
            "focus:border-2 focus:border-primary-500",
          )}
        />
      ))}
    </div>
  );
}
