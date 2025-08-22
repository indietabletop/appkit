/**
 * Checkes whether value is `null` or `undefined`.
 *
 * In some cases, this is preferrable to using `if (!value)`, as that will
 * include `""`, `0`, and `false`, which is not always desirable.
 *
 * This function uses the same semantics like the nullish coalescing operators
 * like `??` and `??=`.
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}
