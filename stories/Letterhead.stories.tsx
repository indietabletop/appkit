import type { Meta, StoryObj } from "@storybook/react-vite";

import { Letterhead } from "../lib/Letterhead";

const meta = {
  title: "Letterhead",
  component: Letterhead,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    backgrounds: {
      default: "gray",
      values: [{ name: "gray", value: "#fafafa" }],
    },
  },
  args: {},
} satisfies Meta<typeof Letterhead>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut enim ad
          minima veniam, quis <em>nostrum</em> exercitationem ullam corporis
          suscipit laboriosam.
        </p>
        <p>
          Nisi ut aliquid ex ea commodi consequatur? Fusce dui leo, imperdiet
          in, aliquam sit amet, feugiat eu, orci. Donec quis nibh at felis
          congue commodo.
        </p>
        <p>
          Ut tempus purus at lorem. Nam quis nulla. Pellentesque pretium lectus
          id turpis. Maecenas aliquet accumsan leo. Maecenas sollicitudin.
        </p>
      </>
    ),
  },
};
