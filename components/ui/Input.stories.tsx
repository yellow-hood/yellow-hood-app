import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { within, userEvent } from "storybook/test";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  args: { label: "Email", placeholder: "you@example.com" },
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "info", "debug", "warning", "success", "error", "fatal"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    isInvalid: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    dir: { control: "select", options: [undefined, "rtl", "ltr"] },
    onValueChange: { action: "valueChanged" },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Playground: Story = {};

export const Invalid: Story = {
  args: { isInvalid: true, errorMessage: "This field is required", isRequired: true },
};

export const HelperText: Story = {
  args: { helperText: "We'll never share your email." },
};

export const LargeSize: Story = { args: { size: "lg" } };

// Dedicated RTL/Persian story. play() focuses the input on load so the
// dark-mode white-border focus override (Input.tsx's
// `dark:rtl:focus:!border-white`, which replaces the primary-yellow focus
// border with #FFFFFF specifically when dir="rtl" + dark theme) is visible
// immediately rather than requiring a manual click during QA.
export const RTLPersian: Story = {
  args: {
    dir: "rtl",
    label: "ایمیل",
    placeholder: "you@example.com را وارد کنید",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    await userEvent.click(input);
  },
};
