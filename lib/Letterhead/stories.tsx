import { FormProvider } from "@ariakit/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Letterhead,
  LetterheadHeading,
  LetterheadParagraph,
  LetterheadSubmitButton,
} from "./index.tsx";

const meta = {
  title: "Letterhead",
  component: Letterhead,
  tags: ["autodocs"],
  args: {
    textAlign: "start",
  },
} satisfies Meta<typeof Letterhead>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <LetterheadHeading align="center" margin="letterhead">
          Lorem ipsum dolor
        </LetterheadHeading>

        <LetterheadParagraph>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut enim ad
          minima veniam, quis <em>nostrum</em> exercitationem ullam corporis
          suscipit laboriosam.
        </LetterheadParagraph>

        <FormProvider>
          <LetterheadSubmitButton marginBlockStart="footerMargin">
            Lorem ipsum
          </LetterheadSubmitButton>
        </FormProvider>
      </>
    ),
  },
};
