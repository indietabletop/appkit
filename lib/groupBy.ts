export function groupBy<T, K extends string>(
  items: T[],
  getKey: (item: T) => K,
) {
  const groups: Partial<Record<K, T[]>> = {};

  for (const item of items) {
    const key = getKey(item);
    const group = groups[key];
    if (group) {
      group.push(item);
    } else {
      groups[key] = [item];
    }
  }

  // Using a Proxy to make sure that even if one of the possible group keys
  // was not included in the provided list, that group will still return
  // an empty list rather than `undefined`.
  return new Proxy(groups, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver) ?? [];
    },
  }) as Record<K, T[]>;
}
