import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReadonlyTextField } from "./index.tsx";

const meta = {
  title: "ReadonlyTextField",
  component: ReadonlyTextField,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof ReadonlyTextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email",
    value: "john@example.com",
    placeholder: "john@example.com",
  },
};
