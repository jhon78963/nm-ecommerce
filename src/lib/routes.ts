/** Rutas públicas del storefront en español. */
export const ROUTES = {
  shop: "/tienda",
  favorites: "/favoritos",
  search: "/buscar",
  product: (slugOrId: string | number) => `/producto/${slugOrId}`,
  institutional: {
    nuestraEmpresa: "/nuestra-empresa",
    tiendas: "/tiendas",
    preguntasFrecuentes: "/preguntas-frecuentes",
    contactanos: "/contactanos",
    terminos: "/terminos-y-condiciones",
    libroReclamaciones: "/libro-de-reclamaciones",
    privacidad: "/politica-de-privacidad",
    cookies: "/politica-de-cookies",
    garantia: "/garantia-y-devoluciones",
    tarifas: "/tarifas-y-zonas",
    ventasMayor: "/ventas-al-por-mayor",
  },
} as const;

export function getProductHref(slugOrId: string | number): string {
  return ROUTES.product(slugOrId);
}
