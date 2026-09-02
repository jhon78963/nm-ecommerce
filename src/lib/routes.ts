/** Rutas públicas del storefront en español. */
export const ROUTES = {
  shop: "/tienda",
  favorites: "/favoritos",
  search: "/buscar",
  product: (slugOrId: string | number) => `/producto/${slugOrId}`,
} as const;

export function getProductHref(slugOrId: string | number): string {
  return ROUTES.product(slugOrId);
}
