/** Rutas públicas del storefront en español. */
export const ROUTES = {
  collection: (slug: string) => `/${slug}`,
  cart: "/carrito",
  checkout: "/checkout",
  orderTracking: "/pedido/seguimiento",
  orderDetails: "/pedido/detalle",
  orderConfirmation: "/pedido/confirmacion",
  favorites: "/favoritos",
  account: {
    root: "/micuenta/miperfil",
    dashboard: "/micuenta/miperfil",
    orders: "/micuenta/pedidos",
    orderDetail: (orderNumber: string) =>
      `/micuenta/pedidos/${encodeURIComponent(orderNumber)}`,
    addresses: "/micuenta/direcciones",
    notifications: "/micuenta/notificaciones",
    refunds: "/micuenta/reembolsos",
    favorites: "/micuenta/favoritos",
  },
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

export function buildSearchPath(
  params: Record<string, string | string[] | undefined> = {},
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
      continue;
    }

    if (value) {
      query.set(key, value);
    }
  }

  const suffix = query.toString();
  return suffix ? `${ROUTES.search}?${suffix}` : ROUTES.search;
}

export function getProductHref(slugOrId: string | number): string {
  return ROUTES.product(slugOrId);
}
