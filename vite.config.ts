import { defineNetlifyConfig } from "@indietabletop/tooling/defineNetlifyConfig";

// This config is only necessary for Storybook.
export default defineNetlifyConfig({
  inputFile: "main.tsx",
  renderEntrypoint: () => ``,
  port: 5000,
});
