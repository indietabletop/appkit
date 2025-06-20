import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

const atomic = defineProperties({
  properties: {
    textAlign: ["start", "center", "end"],
  },
});

export const textVariants = createSprinkles(atomic);

export type TextVariants = Parameters<typeof textVariants>[0];
