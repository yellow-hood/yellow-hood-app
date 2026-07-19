import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Chip } from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "UI/Chip",
  component: Chip,
  args: { children: "Label", color: "default", variant: "flat", size: "md" },
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    variant: { control: "select", options: ["flat", "bordered", "solid", "dot"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    isDisabled: { control: "boolean" },
    onClose: { action: "closed" },
  },
};
export default meta;

type Story = StoryObj<typeof Chip>;

export const Playground: Story = {};

export const Removable: Story = {
  args: { onClose: () => {}, children: "Removable" },
};

const COLORS = ["default", "primary", "secondary", "success", "warning", "danger"] as const;
const VARIANTS = ["flat", "bordered", "solid", "dot"] as const;
const SIZES = ["sm", "md", "lg"] as const;

// One All-Variants Matrix story: color x variant x size, grouped by size —
// matches the Design System doc's Chip table for a direct visual diff.
export const AllVariantsMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-3">
          <p className="text-sm font-medium text-default-500">size: {size}</p>
          <div className="grid grid-cols-6 gap-4">
            {VARIANTS.map((variant) =>
              COLORS.map((color) => (
                <div key={`${variant}-${color}`} className="flex flex-col items-center gap-1">
                  <Chip color={color} variant={variant} size={size}>
                    {color}
                  </Chip>
                  <span className="text-xs text-default-400">{variant}</span>
                </div>
              )),
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};
