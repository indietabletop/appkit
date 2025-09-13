type UniqueKey = string | number;

/**
 * Returns an array of unique items, determining uniqueness via the getKey
 * function.
 *
 * Note that the first unique item is returned, all others are omitted
 * (assuming that they are unique, so it shouldn't matter).
 */
export function uniqueBy<T>(items: T[], getKey: (item: T) => UniqueKey): T[] {
  const seen = new Set<UniqueKey>();
  const returnItems: T[] = [];

  for (const item of items) {
    const uniqueKey = getKey(item);

    if (!seen.has(uniqueKey)) {
      returnItems.push(item);
      seen.add(uniqueKey);
    }
  }

  return returnItems;
}
