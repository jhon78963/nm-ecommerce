/** Aligns with ecommerce-service Redis cache TTL (300s) in production. */
export const STORE_CONTENT_REVALIDATE_SECONDS =
  process.env.NODE_ENV === "production" ? 300 : 0;
