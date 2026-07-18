import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarImage, AvatarFallback } from "@qpub/qui";
import { cn } from "@/lib/utils";

// No components/ui/Avatar.tsx wrapper exists — Avatar is used directly from
// @qpub/qui, sized via Tailwind classes at call sites. This mirrors the
// AVATAR_SIZES pattern in app/design-system/page.tsx exactly (same
// dimensions/radius/initials per size).
const AVATAR_SIZES = [
  { size: "xl", px: 80, avatarClass: "h-20 w-20 rounded-large", textClass: "text-lg", initials: "FH" },
  { size: "lg", px: 64, avatarClass: "h-16 w-16", textClass: "text-base", initials: "AN" },
  { size: "md", px: 48, avatarClass: "h-12 w-12", textClass: "text-sm", initials: "KM" },
  { size: "sm", px: 32, avatarClass: "h-8 w-8", textClass: "text-xs", initials: "YH" },
] as const;

type AvatarSize = (typeof AVATAR_SIZES)[number]["size"];

function AvatarDemo({ size, active }: { size: AvatarSize; active?: boolean }) {
  const spec = AVATAR_SIZES.find((s) => s.size === size)!;
  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className={cn(spec.avatarClass, active && "ring-2 ring-primary")}>
        <AvatarImage src={undefined} alt="" />
        <AvatarFallback className={spec.textClass}>{spec.initials}</AvatarFallback>
      </Avatar>
      <p className="text-xs text-default-500">{spec.size.toUpperCase()} — {spec.px}px</p>
    </div>
  );
}

const meta: Meta<typeof AvatarDemo> = {
  title: "UI/Avatar",
  component: AvatarDemo,
  args: { size: "md", active: false },
  argTypes: {
    size: { control: "select", options: ["xl", "lg", "md", "sm"] },
    // Optional ring-2 ring-primary active/selected state — applies
    // uniformly across all four sizes per the Design System doc.
    active: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof AvatarDemo>;

export const Playground: Story = {};

export const Active: Story = { args: { active: true } };

// All-sizes row, largest to smallest — matches every other component
// family's specimen layout on /design-system.
export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      {AVATAR_SIZES.map(({ size }) => (
        <AvatarDemo key={size} size={size} />
      ))}
    </div>
  ),
};

export const AllSizesActive: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      {AVATAR_SIZES.map(({ size }) => (
        <AvatarDemo key={size} size={size} active />
      ))}
    </div>
  ),
};
