import { createVar, keyframes, style } from "@vanilla-extract/css";
import { manofa, minion } from "../common.css.ts";
import { Hover } from "../media.ts";
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

export const minRows = createVar();

export const fieldTextAreaContainer = style([
  border,
  {
    display: "block",
    position: "relative",
  },
]);

const textArea = style({
  display: "block",
  fontSize: "1rem",
  lineHeight: "1.25rem",
  padding: "1rem",
  minHeight: `calc(2 * 1rem + ${minRows} * 1.25rem)`,
});

export const fieldTextAreaSpacer = style([
  textArea,
  {
    visibility: "hidden",
  },
]);

export const fieldTextAreaSpacerLine = style({
  display: "block",
  minHeight: "1.25rem",
});

export const fieldTextArea = style([
  textArea,
  {
    resize: "none",
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    border: "none",
    borderRadius: "inherit",
  },
]);

export const issue = style({
  color: Color.purple,
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
    [`${issue}:not(:empty) + &`]: {
      display: "none",
    },
  },
});

export const checkbox = style({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  position: "relative",
});

export const checkboxContainer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  width: "1.5rem",
  height: "1.5rem",
});

export const checkboxInput = style({
  appearance: "none",
  position: "absolute",
  backgroundColor: Color.LIGHT_GRAY,
  borderRadius: "0.25rem",
  width: "100%",
  height: "100%",

  "@media": {
    [Hover.HOVER]: {
      transition: "box-shadow 200ms",

      selectors: {
        "&:hover:not(:disabled)": {
          boxShadow: "inset 0 0 0 2px hsl(0 0% 0% / 0.2)",
        },
      },
    },
  },
});

const appear = keyframes({
  from: { transform: "scale(1.5) rotate(-5deg)", opacity: 0 },
  to: { transform: "scale(1) rotate(0)", opacity: 1 },
});

export const checkboxMark = style({
  visibility: "hidden",
  position: "absolute",

  selectors: {
    [`${checkboxInput}:checked + &`]: {
      visibility: "visible",
      animation: `${appear} 200ms ease-in-out`,
    },
  },
});

export const radioInput = style([
  checkboxInput,
  {
    borderRadius: "50%",
    width: "85%",
    height: "85%",
  },
]);

export const inputLabel = style({
  flexGrow: "1",
  lineHeight: 1,

  // Optical alignment
  // position: "relative",
  // top: "0.1em",
});

export const inputExtra = style({
  flex: "0 0 max-content",
  lineHeight: 1,

  // Optical alignment
  // position: "relative",
  // top: "0.1em",
});

export const radioGroup = style([border, {}]);

export const radioOption = style([
  checkbox,
  {
    padding: "1rem",
    borderBottom: "1px solid #ececec",

    ":last-child": {
      borderBottom: "none",
    },
  },
]);

export const inputsGroup = style({
  display: "grid",
  gap: "1.25rem",
});
