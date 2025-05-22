/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
 */

export enum PrefersColorScheme {
  LIGHT = "(prefers-color-scheme: light)",
  DARK = "(prefers-color-scheme: dark)",
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 */

export enum PrefersReducedMotion {
  NO_PREFERENCE = "(prefers-reduced-motion: no-preference)",
  REDUCE = "(prefers-reduced-motion: reduce)",
}

export enum Hover {
  NONE = "(hover: none)",

  // Some Samsung phones incorrectly report that they have "hover" even though they
  // do not. Adding the pointer query correctly filters these phones out.
  HOVER = "(hover: hover) and (pointer: fine)",
}

export enum MediaType {
  PRINT = "print",
  SCREEN = "screen",
}

export enum MinHeight {
  TALL = "(min-height: 40em)",
}

export enum MinWidth {
  SMALL = "(min-width: 28em)",
  MEDIUM = "(min-width: 50em)",
  WIDE = "(min-width: 66em)",
  X_WIDE = "(min-width: 80em)",
  XX_WIDE = "(min-width: 140em)",
}

export enum DisplayMode {
  STANDALONE = "(display-mode: standalone)",
}

export enum Pointer {
  COARSE = "(pointer: coarse)",
  FINE = "(pointer: fine)",
}
