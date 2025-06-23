import type { Meta, StoryObj } from "@storybook/react-vite";
import { LetterheadReadonlyTextField } from "./index.tsx";

const meta = {
  title: "ReadonlyTextField",
  component: LetterheadReadonlyTextField,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof LetterheadReadonlyTextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email",
    value: "john@example.com",
    placeholder: "john@example.com",
  },
};
