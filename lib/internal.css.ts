import { createVar, style } from "@vanilla-extract/css";
import { bounce } from "./animations.css.ts";
import { minion } from "./common.css.ts";

export const animationDelay = createVar();

export const dot = style({
  fill: "currentcolor",
  opacity: 0.8,
  animation: `${bounce} 2s ${animationDelay} infinite`,
});

export const padding = createVar();

export const letterhead = style([
  minion,
  {
    vars: { [padding]: "clamp(1rem, 8vw, 4rem)" },

    backgroundColor: "white",
    padding: `max(1rem, calc(${padding} - .5rem)) ${padding} ${padding}`,
    borderRadius: "1rem",
    marginInline: "auto",
    maxInlineSize: "36rem",
  },
]);
