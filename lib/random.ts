export function random(max: number) {
  return Math.floor(Math.random() * max);
}

export function randomItem<T>(array: T[]) {
  return array[random(array.length)];
}
