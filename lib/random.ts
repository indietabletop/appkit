export function random(max: number) {
  return Math.floor(Math.random() * max);
}

export function randomItem<T>(array: T[]) {
  return array[random(array.length)];
}

export function randomItemOrThrow<T>(array: T[]) {
  const item = array[random(array.length)];

  if (!item) {
    throw new Error(
      "Could not select a random item from list. Perhaps the list is empty?",
    );
  }

  return item;
}
