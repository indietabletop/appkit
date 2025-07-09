import { style, type ComplexStyleRule } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { MinWidth } from "../media.ts";

const scaleTransition: ComplexStyleRule = {
  transition: "transform 200ms, opacity 200ms",
  transform: "scale(1.1)",

  selectors: {
    "&[data-enter]": {
      opacity: 1,
      transform: "scale(1)",
    },

    "&[data-leave]": {
      opacity: 0,
      transform: "scale(0.9)",
    },
  },
};

const translateTransition: ComplexStyleRule = {
  transition: "transform 200ms, opacity 200ms",
  transform: "translateY(5rem)",

  selectors: {
    "&[data-enter]": {
      opacity: 1,
      transform: "translateY(0)",
    },

    "&[data-leave]": {
      opacity: 0,
      transform: "translateY(5rem)",
    },
  },
};

export const dialog = recipe({
  base: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    margin: "auto",
    overflow: "auto",
    opacity: 0,
    backgroundColor: "white",
  },

  variants: {
    variant: {
      form: {
        ...translateTransition,
        inlineSize: "100%",
        blockSize: "100%",

        "@media": {
          [MinWidth.MEDIUM]: {
            ...scaleTransition,
            blockSize: "fit-content",
            maxInlineSize: "40rem",
            maxBlockSize: "90%",
            borderRadius: "1rem",
          },
        },
      },

      confirm: {
        ...scaleTransition,
        inlineSize: "min(24rem, 90svw)",
        blockSize: "fit-content",
        borderRadius: "1rem",
      },
    },
  },
});

export const backdrop = style({
  backgroundColor: "black",
  opacity: 0,
  transition: "opacity 200ms",
  selectors: {
    "&[data-enter]": {
      opacity: 0.4,
    },
  },
});
