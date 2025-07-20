import { globalStyle } from "@vanilla-extract/css";

// Apply global vars
import "./vars.css.ts";

globalStyle(":root", {
  fontSynthesis: "none",
  textRendering: "optimizeLegibility",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  WebkitTapHighlightColor: "transparent",
});

globalStyle("*", {
  boxSizing: "border-box",
});

globalStyle("img, picture, svg", {
  display: "block",
});

globalStyle("a", {
  display: "block",
  color: "inherit",
  textDecoration: "none",
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
  padding: 0,
});

globalStyle("body, h1, h2, h3, h4, h5, h6, p, ul, li, ol", {
  margin: 0,
  padding: 0,
});

// Fathom SPA support depends on this image being added to the DOM, but they
// are sloppy about taking out of the document flow, meaning that on pages
// that are 100vh, there is a scrollbar flicker as the img element is added
// to the DOM and then removed. This fixes said issue.
globalStyle(`img[src^="https://cdn.usefathom.com/"]`, {
  position: "absolute",
  top: 0,
  left: 0,
  opacity: 0.01,
});
