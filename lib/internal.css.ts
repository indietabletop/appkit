import { createVar, style } from "@vanilla-extract/css";
import { bounce } from "./animations.css.ts";

export const animationDelay = createVar();

export const dot = style({
  fill: "currentcolor",
  opacity: 0.8,
  animation: `${bounce} 2s ${animationDelay} infinite`,
});
