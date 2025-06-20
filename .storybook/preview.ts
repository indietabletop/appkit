import type { Preview } from "@storybook/react-vite";
import "../lib/globals.css.ts";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
