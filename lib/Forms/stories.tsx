import { FormProvider } from "@ariakit/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormTextField } from "./index.tsx";

const meta = {
  title: " FormTextField",
  component: FormTextField,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof FormTextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "john@example.com",
    name: "foo",
  },
  render(args) {
    return (
      <FormProvider>
        <FormTextField {...args} name="foo" />
      </FormProvider>
    );
  },
};
