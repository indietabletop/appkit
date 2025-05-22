import { keyframes } from "@vanilla-extract/css";

export const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const slideUp = keyframes({
  from: { transform: `translateY(100%)` },
  to: { transform: `translateY(0)` },
});

export const bounce = keyframes({
  "0%": { transform: "translateY(0)" },
  "20%": { transform: "translateY(-20%)" },
  "50%": { transform: "translateY(0)" },
});
