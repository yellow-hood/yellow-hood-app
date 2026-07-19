import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: { children: "Button", variant: "solid", color: "primary", size: "md" },
  argTypes: {
    // Full real @qpub/qui union, not just the Design System doc's documented
    // subset — every value here is confirmed either wired (styled) or the
    // doc's own matrix; nothing fake. See the Undocumented story below for
    // the values that render but aren't in the doc yet.
    variant: {
      control: "select",
      options: ["solid", "faded", "bordered", "light", "flat", "ghost", "link"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "info", "debug", "warning", "success", "error", "fatal", "default"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    isDisabled: { control: "boolean" },
    isLoading: { control: "boolean" },
    isIconOnly: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Loading: Story = { args: { isLoading: true } };

export const IconOnly: Story = {
  args: { isIconOnly: true, "aria-label": "Icon button", children: "★" },
};

// Design System doc's documented matrix only: primary/secondary/default/
// error/success/warning at sm/md/lg, across all 4 doc-documented variant
// types (all 4 support all 6 doc colors per the doc's Color x Type
// Availability Matrix — only AnimatedButton has real color restrictions).
const DOC_COLORS = ["primary", "secondary", "default", "error", "success", "warning"] as const;
const DOC_SIZES = ["sm", "md", "lg"] as const;

function matrixRender(variant: "solid" | "bordered" | "flat" | "ghost") {
  function VariantMatrix() {
    return (
      <div className="grid grid-cols-3 gap-6">
        {DOC_SIZES.map((size) => (
          <div key={size} className="flex flex-col gap-3">
            <p className="text-sm font-medium text-default-500">size: {size}</p>
            <div className="flex flex-col gap-2">
              {DOC_COLORS.map((color) => (
                <Button key={color} variant={variant} color={color} size={size}>
                  {color}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return VariantMatrix;
}

export const SolidMatrix: Story = { parameters: { controls: { disable: true } }, render: matrixRender("solid") };
export const BorderedMatrix: Story = { parameters: { controls: { disable: true } }, render: matrixRender("bordered") };
export const FlatMatrix: Story = { parameters: { controls: { disable: true } }, render: matrixRender("flat") };
export const GhostMatrix: Story = { parameters: { controls: { disable: true } }, render: matrixRender("ghost") };

// Values that exist on @qpub/qui's real Button prop types but are NOT in the
// Yellow Hood Design System doc. Verified by direct render (not assumed):
// all six are genuinely styled via qui's own compiled classes/tokens, not
// broken/unstyled leftovers, so they stay selectable in Controls above —
// but are kept out of the doc-scoped matrix stories. Flagged here (and in
// this task's Execution Report) for a future decision on whether to
// document or remove them; not decided in this task.
export const Undocumented: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-default-500">undocumented variants (color=primary)</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="faded" color="primary">faded</Button>
          <Button variant="light" color="primary">light</Button>
          <Button variant="link" color="primary">link</Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-default-500">undocumented colors (variant=solid)</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="solid" color="info">info</Button>
          <Button variant="solid" color="debug">debug</Button>
          <Button variant="solid" color="fatal">fatal</Button>
        </div>
      </div>
    </div>
  ),
};
