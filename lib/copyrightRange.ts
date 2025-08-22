export function copyrightRange(yearSince: number) {
  const currentYear = new Date().getFullYear();
  return currentYear === yearSince
    ? `© ${yearSince}`
    : `© ${yearSince}–${currentYear}`;
}
