import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnimatedButton } from "./AnimatedButton";

const meta: Meta<typeof AnimatedButton> = {
  title: "UI/AnimatedButton",
  component: AnimatedButton,
  args: { children: "Continue", color: "primary", size: "lg" },
  argTypes: {
    color: { control: "select", options: ["primary", "secondary", "default"] },
    size: { control: "select", options: ["lg", "xl"] },
    isDisabled: { control: "boolean" },
    isLoading: { control: "boolean" },
    // Real prop, not in the Design System doc's prop table — verified by
    // direct render (see Undocumented story) that it genuinely works (applies
    // the standard `w-full` utility), so kept selectable rather than excluded.
    fullWidth: { control: "boolean" },
    // Real prop name confirmed by reading AnimatedButton.tsx directly: it
    // spreads React.ButtonHTMLAttributes and has no `onPress` prop anywhere,
    // despite the Epic's task text referring to `onPress` — `onClick` is the
    // only real click handler, so that's what Controls/Actions map to here.
    onClick: { action: "clicked" },
  },
};
export default meta;

type Story = StoryObj<typeof AnimatedButton>;

export const Playground: Story = {};

export const Loading: Story = { args: { isLoading: true } };

const COLORS = ["primary", "secondary", "default"] as const;
const SIZES = ["lg", "xl"] as const;

// color x size matrix — AnimatedButton is the one family with real
// restrictions per the doc (no Solid/Bordered/Flat/Ghost equivalents exist).
export const AllVariantsMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-8 text-sm font-medium text-default-500">{size}</span>
          {COLORS.map((color) => (
            <AnimatedButton key={color} color={color} size={size}>
              {color}
            </AnimatedButton>
          ))}
        </div>
      ))}
    </div>
  ),
};

// `fullWidth` (see argTypes above) needs a constrained container to be
// visually meaningful — a bare Controls toggle on Playground would just
// stretch to the canvas width, so it's demonstrated here too.
export const Undocumented: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-96">
      <AnimatedButton fullWidth>Full width</AnimatedButton>
    </div>
  ),
};
