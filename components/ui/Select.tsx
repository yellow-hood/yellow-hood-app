"use client";

import * as React from "react";
import { SelectTrigger as QuiSelectTrigger } from "@qpub/qui";
import { cn } from "@/lib/utils";

type QuiSelectTriggerProps = React.ComponentProps<typeof QuiSelectTrigger>;

export function SelectTrigger({ size, className, ...props }: QuiSelectTriggerProps) {
  // Same default-height override as components/ui/Button.tsx: qui's default/md
  // (no `size` prop, or explicit size="md") renders 36px (h-9); the app wants
  // 40px (h-10) without touching sm (28px) or lg (48px) when explicitly requested.
  const isDefaultOrMd = size === undefined || size === "md";
  return (
    <QuiSelectTrigger
      size={size}
      className={isDefaultOrMd ? cn("h-10", className) : className}
      {...props}
    />
  );
}
