import { style } from "@vanilla-extract/css";
import { Hover, MinWidth } from "./media.ts";

export const itcSymbol = style({
  inlineSize: "2.5rem",
  blockSize: "2.5rem",
  margin: "0rem auto 0.75rem",

  "@media": {
    [MinWidth.MEDIUM]: {
      marginBlock: "-1rem 1.5rem",
    },
  },
});

export const manofa = style({
  fontFamily: `"manofa", sans-serif`,
});

export const minion = style({
  fontFamily: `"minion-pro", serif`,
});

export const itcCard = style([
  minion,
  {
    backgroundColor: "white",
  },
]);

export const interactiveText = style({
  display: "inline",
  textDecoration: "underline",
  textDecorationColor: "hsl(from currentcolor h s l / 0.3)",
  textUnderlineOffset: "0.15em",

  "@media": {
    [Hover.HOVER]: {
      transition: "text-decoration-color 200ms",

      ":hover": {
        textDecorationColor: "hsl(from currentcolor h s l / 1)",
      },
    },
  },
});
