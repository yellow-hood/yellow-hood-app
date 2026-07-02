"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  onComplete?: (otp: string) => void;
  className?: string;
}

export function OtpInput({ onComplete, className }: OtpInputProps) {
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
            "h-16 w-12 rounded-medium border text-center text-xl font-semibold outline-none transition-colors",
            "border-default-200 bg-background text-foreground",
            "focus:border-2 focus:border-default-400",
          )}
        />
      ))}
    </div>
  );
}
