import { style } from "@vanilla-extract/css";
import { manofa, minion } from "../common.css.ts";
import { Color } from "../vars.css.ts";

const border = style({
  borderRadius: "0.5rem",
  border: `1px solid ${Color.GRAY}`,
});

export const field = style({
  display: "block",
});

export const fieldLabel = style([
  manofa,
  {
    display: "block",
    textTransform: "uppercase",
    fontSize: "0.75rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
  },
]);

export const fieldInput = style([
  border,
  minion,
  {
    display: "block",
    width: "100%",
    fontSize: "1rem",
    lineHeight: "1.25rem",
    padding: "1rem 0 1rem 1rem",

    ":read-only": {
      backgroundColor: "hsl(0 0% 0% / 0.05)",
    },

    // Hide MS Edge widgets -- we handle them manually
    "::-ms-clear": {
      display: "none",
    },
    "::-ms-reveal": {
      display: "none",
    },
  },
]);

export const fieldIssue = style({
  color: Color.PURPLE,
  fontSize: "0.875rem",
  marginTop: "0.5rem",

  ":empty": {
    display: "none",
  },
});

export const fieldHint = style({
  color: Color.MID_GRAY,
  fontSize: "0.875rem",
  marginTop: "0.5rem",

  selectors: {
    [`${fieldIssue}:not(:empty) + &`]: {
      display: "none",
    },
  },
});

export const submitError = style({
  padding: "1rem",
  color: Color.PURPLE,
  backgroundColor: Color.PALE_GRAY,
  borderRadius: "0.75rem",

  ":empty": {
    display: "none",
  },
});
