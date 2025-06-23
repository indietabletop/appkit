import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../lib/**/*.stories.@(ts|tsx)", "../lib/**/stories.tsx"],
  addons: ["@storybook/addon-onboarding", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
