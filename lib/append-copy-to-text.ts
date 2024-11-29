/**
 * Appends " (Copy)" to the end of the input string if it doesn't already end
 * with " (Copy)", otherwise it appends a number after "Copy", incrementing it
 * if necessary.
 */
export function appendCopyToText(input: string): string {
  const regex = /^(?<value>.*) \(Copy(?: (?<count>\d+))?\)$/;
  const match = input.match(regex);

  // If there isn't a match, we directly append to the input.
  if (!match) {
    return `${input.trim()} (Copy)`;
  }

  const { value, count } = match.groups ?? {};

  // If `count` capturing group is not present, it means that the input ends
  // with the copy suffix, but it doesn't contain count.
  const nextCount = !count ? 2 : parseInt(count, 10) + 1;

  return `${value.trim()} (Copy ${nextCount})`;
}

/**
 * Works like {@link appendCopyToText}, but ignores empty strings.
 */
export function maybeAppendCopyToText(input: string) {
  // If input is falsy (i.e. empty string) then we don't want to append
  // anything to it.
  if (!input) {
    return "";
  }

  return appendCopyToText(input);
}
