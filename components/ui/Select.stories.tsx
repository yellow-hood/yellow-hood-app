import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select, SelectValue } from "@qpub/qui";
import { SelectTrigger, SelectContent, SelectItem } from "./Select";

// No single `Select` wrapper exists in components/ui/Select.tsx (only
// SelectTrigger/SelectContent/SelectItem) — this composes those with the
// root Select/SelectValue straight from @qpub/qui, mirroring the real usage
// pattern already in app/design-system/page.tsx.
function SelectDemo({
  size,
  isDisabled,
}: {
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
}) {
  return (
    <Select isDisabled={isDisabled}>
      <SelectTrigger size={size} className="w-64" aria-label="Role">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent size={size}>
        <SelectItem size={size} value="editor">Editor</SelectItem>
        <SelectItem size={size} value="viewer">Viewer</SelectItem>
        <SelectItem size={size} value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}

const meta: Meta<typeof SelectDemo> = {
  title: "UI/Select",
  component: SelectDemo,
  args: { size: "md" },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    isDisabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof SelectDemo>;

export const Playground: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

// Size matrix — default(no size prop)/md and lg are the two officially used
// sizes per the Design System doc; sm included since it's a real TS-typed
// value on SelectTrigger/Content/Item.
export const SizeMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-end gap-6">
      <SelectDemo size="sm" />
      <SelectDemo size="md" />
      <SelectDemo size="lg" />
    </div>
  ),
};
