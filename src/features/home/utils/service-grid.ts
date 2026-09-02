export function getServiceGridClass(count: number): string {
  if (count === 4) {
    return "home-services-grid--four";
  }

  if (count === 3) {
    return "home-services-grid--three";
  }

  if (count === 2) {
    return "home-services-grid--two";
  }

  return "home-services-grid--one";
}
