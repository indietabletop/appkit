import { globalStyle } from "@vanilla-extract/css";

globalStyle("*", {
  boxSizing: "border-box",
});

globalStyle("img, picture, svg", {
  display: "block",
});

globalStyle("a", {
  color: "inherit",
});

globalStyle("input, textarea", {
  fontFamily: "inherit",
});

globalStyle("button", {
  display: "block",
  fontSize: "inherit",
  fontFamily: "inherit",
  backgroundColor: "transparent",
  border: "none",
  color: "inherit",
  cursor: "pointer",
});
