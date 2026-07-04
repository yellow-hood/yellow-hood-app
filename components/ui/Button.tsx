"use client";

import * as React from "react";
import { Button as QuiButton } from "@qpub/qui";
import { cn } from "@/lib/utils";

type QuiButtonProps = React.ComponentProps<typeof QuiButton>;

export function Button({ size, className, ...props }: QuiButtonProps) {
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

  return (
    <QuiButton
      size={size}
      className={cn(sizeOverride, className)}
      {...(props as QuiButtonProps)}
    />
  );
}
