import type { Meta, StoryObj } from "@storybook/react-vite";
import { form } from "../storybook/decorators.tsx";
import { LetterheadTextField } from "./index.tsx";

const meta = {
  title: "FormTextField",
  component: LetterheadTextField,
  tags: ["autodocs"],
  args: {},
  decorators: [form()],
} satisfies Meta<typeof LetterheadTextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "john@example.com",
    name: "foo",
  },
};
