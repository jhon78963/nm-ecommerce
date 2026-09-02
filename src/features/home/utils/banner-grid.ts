export function getBannerGridClass(count: number): string {
  if (count >= 4) {
    return "grid-cols-2 lg:grid-cols-4";
  }

  if (count === 3) {
    return "grid-cols-2 lg:grid-cols-3";
  }

  if (count === 2) {
    return "grid-cols-2";
  }

  return "grid-cols-1";
}
