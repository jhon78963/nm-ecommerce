/** `ratingCount` en catálogo es el promedio de estrellas (nombre legacy). */
export function getRoundedProductRating(rating: number | null | undefined): number {
  if (rating == null || !Number.isFinite(rating)) {
    return 0;
  }

  return Math.round(rating);
}

export function isStarFilled(rating: number, starIndex: number): boolean {
  return getRoundedProductRating(rating) >= starIndex + 1;
}
