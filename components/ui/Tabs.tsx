"use client";

import * as React from "react";
import {
  Tabs as QuiTabs,
  TabsList as QuiTabsList,
  TabsTrigger as QuiTabsTrigger,
  TabsContent,
} from "@qpub/qui";
import { cn } from "@/lib/utils";

type QuiTabsProps = React.ComponentProps<typeof QuiTabs>;
type QuiTabsListProps = React.ComponentProps<typeof QuiTabsList>;
type QuiTabsTriggerProps = React.ComponentProps<typeof QuiTabsTrigger>;

// Design System doc's pill/segmented Tabs spec: rounded-full track, active
// trigger rendered as a solid rounded-full pill filled with the primary
// color, inactive triggers sit directly on the track with no background.
// Default color to "primary" so the documented look is on by default for
// any future adoption, matching solid/primary being what the doc's color
// table below assumes.
export function Tabs({ variant = "solid", color = "primary", ...props }: QuiTabsProps) {
  return <QuiTabs variant={variant} color={color} {...props} />;
}

// qui renders the active-tab pill via a separate absolutely-positioned
// indicator element (data-slot="tabs-indicator", position tracked via
// getBoundingClientRect — see node_modules/@qpub/qui/dist/index.mjs) that has
// no className prop of its own. Its radius/shadow can only be reached from
// here via an arbitrary child-combinator selector targeting that data-slot.
export function TabsList({ className, ...props }: QuiTabsListProps) {
  return (
    <QuiTabsList
      className={cn(
        "rounded-full bg-default-100 dark:bg-default-800",
        "[&>[data-slot='tabs-indicator']]:rounded-full [&>[data-slot='tabs-indicator']]:border-transparent [&>[data-slot='tabs-indicator']]:shadow-none",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: QuiTabsTriggerProps) {
  return (
    <QuiTabsTrigger
      className={cn(
        "rounded-full text-default-500 hover:text-default-500",
        // Doc specifies a distinct muted color for disabled, not a generic
        // opacity fade — disabled:opacity-100 cancels qui's own
        // disabled:opacity-50 so the color change is what actually reads.
        "disabled:text-default-400 dark:disabled:text-default-600 disabled:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export { TabsContent };
