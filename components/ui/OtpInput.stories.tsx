import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OtpInput } from "./OtpInput";

const meta: Meta<typeof OtpInput> = {
  title: "UI/OtpInput",
  component: OtpInput,
  args: { size: "lg" },
  argTypes: {
    size: { control: "select", options: ["sm", "lg"] },
    onComplete: { action: "completed" },
  },
};
export default meta;

type Story = StoryObj<typeof OtpInput>;

export const Playground: Story = {};

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <OtpInput size="sm" />
      <OtpInput size="lg" />
    </div>
  ),
};
