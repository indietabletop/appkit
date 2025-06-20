import { createTheme, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { textVariants } from "../atomic.css.ts";
import { manofa, minion } from "../common.css.ts";
import { Hover } from "../media.ts";

const align = {
  start: textVariants({ textAlign: "start" }),
  center: textVariants({ textAlign: "center" }),
  end: textVariants({ textAlign: "end" }),
};

export const [letterheadTheme, { padding, footerMargin }] = createTheme({
  padding: "clamp(1rem, 8vw, 4rem)",
  footerMargin: "3rem",
});

export const letterhead = recipe({
  base: [
    letterheadTheme,
    minion,
    {
      backgroundColor: "white",
      padding: `calc(${padding} / 2) ${padding} ${padding}`,
      borderRadius: "1rem",
      marginInline: "auto",
      maxInlineSize: "36rem",
    },
  ],

  defaultVariants: {
    textAlign: "center",
  },

  variants: {
    textAlign: align,
  },
});

export const letterheadSymbol = style({
  marginBlockEnd: "0.5rem",
  marginInline: "auto",
  display: "block",
  inlineSize: "2.5rem",
  blockSize: "2.5rem",
});

export const heading = recipe({
  base: [
    manofa,
    {
      fontWeight: 400,
      fontSize: "1.5rem",
      marginBlockEnd: "1rem",
      lineHeight: 1.2,
    },
  ],

  variants: {
    align,

    margin: {
      letterhead: {
        marginBlockEnd: `min(calc(${padding} / 2), 1.5rem)`,
      },
    },
  },
});

export const paragraph = recipe({
  base: [
    minion,
    {
      lineHeight: 1.5,
      selectors: {
        "& + &": { marginTop: "0.5lh" },
      },
    },
  ],

  defaultVariants: {
    size: "default",
  },

  variants: {
    size: {
      small: { fontSize: "0.875rem" },
      default: { fontSize: "1rem" },
    },
    align,
  },
});

export const button = recipe({
  base: [
    manofa,
    {
      letterSpacing: 0,
      textTransform: "uppercase",
      backgroundColor: "black",
      color: "white",
      width: "100%",
      border: "none",
      borderRadius: "0.5rem",
      padding: "1rem 1.5rem",
      fontSize: "0.875rem",

      "@media": {
        [Hover.HOVER]: {
          transition: "box-shadow 400ms",

          ":hover": {
            boxShadow: "inset 0 0 0 2px hsl(0 0% 100% / 0.5)",
          },
        },
      },
    },
  ],

  variants: {
    marginBlockStart: {
      footerMargin: { marginBlockStart: `calc(${footerMargin} - 0.5rem)` },
    },
  },
});

export const letterheadFooter = style({
  textAlign: "center",
  marginBlockStart: footerMargin,
  paddingBlockStart: "2rem",
  borderBlockStart: "1px solid #ececec",
});

export const letterheadFooterLogo = style({
  margin: "0 auto 1.125rem",
});

export const letterheadFooterInfo = style({
  margin: "0 auto",
  maxInlineSize: "25rem",
});
