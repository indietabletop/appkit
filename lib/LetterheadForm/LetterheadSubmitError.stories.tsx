import type { Meta, StoryObj } from "@storybook/react-vite";
import { form } from "../storybook/decorators.tsx";
import { LetterheadSubmitError } from "./index.tsx";

const meta = {
  title: "LetterheadSubmitError",
  component: LetterheadSubmitError,
  tags: ["autodocs"],
  args: {},
  decorators: [
    form({ defaultErrors: { submit: "This is an error message." } }),
  ],
} satisfies Meta<typeof LetterheadSubmitError>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "submit",
  },
};
