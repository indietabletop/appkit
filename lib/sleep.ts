/**
 * Pause for the specified number of milliseconds.
 *
 * This function is useful for testing, or slowing down responses in cases
 * where we want to wait for some short-lived cache to clear first.
 *
 * @example
 * ```ts
 * await sleep(2000) // Waits for 2s
 * ```
 */
export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
