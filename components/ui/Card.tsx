"use client";

import * as React from "react";
import { Card as QuiCard } from "@qpub/qui";
import { cn } from "@/lib/utils";

type QuiCardProps = React.ComponentProps<typeof QuiCard>;

export function Card({ className, ...props }: QuiCardProps) {
  // Border-radius is pinned to rounded-large (14px) — qui's own Card renders
  // rounded-xl (12px), which doesn't match the Design System doc's 14px card
  // token. The `!` important modifier forces rounded-large to actually win
  // (same pattern as components/ui/Input.tsx and components/ui/Select.tsx):
  // tailwind-merge doesn't recognize this app's custom radius keys as
  // conflicting with qui's built-in rounded-xl.
  return <QuiCard className={cn("!rounded-large", className)} {...props} />;
}
