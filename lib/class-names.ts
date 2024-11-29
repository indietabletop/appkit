/**
 * Combines a list of strings into a single string. Falsy values are ignored.
 */
export function classNames(
  ...classNames: (string | false | null | undefined)[]
) {
  return classNames.filter((c) => !!c).join(" ");
}
