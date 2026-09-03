/** Rutas del área Mi cuenta (cliente autenticado). */
export const ACCOUNT_ROUTES = {
  root: "/micuenta/miperfil",
  dashboard: "/micuenta/miperfil",
  orders: "/micuenta/pedidos",
  orderDetail: (orderNumber: string) => `/micuenta/pedidos/${encodeURIComponent(orderNumber)}`,
  addresses: "/micuenta/direcciones",
  notifications: "/micuenta/notificaciones",
  refunds: "/micuenta/reembolsos",
  favorites: "/micuenta/favoritos",
} as const;

export type AccountNavId =
  | "dashboard"
  | "orders"
  | "favorites"
  | "addresses"
  | "notifications"
  | "refunds";

export interface AccountNavItem {
  id: AccountNavId;
  label: string;
  href: string;
  icon: "home" | "orders" | "heart" | "address" | "bell" | "refund";
  badge?: number;
}

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  { id: "dashboard", label: "Mi perfil", href: ACCOUNT_ROUTES.dashboard, icon: "home" },
  { id: "orders", label: "Mis pedidos", href: ACCOUNT_ROUTES.orders, icon: "orders" },
  { id: "favorites", label: "Favoritos", href: ACCOUNT_ROUTES.favorites, icon: "heart" },
  { id: "addresses", label: "Direcciones", href: ACCOUNT_ROUTES.addresses, icon: "address" },
  {
    id: "notifications",
    label: "Notificaciones",
    href: ACCOUNT_ROUTES.notifications,
    icon: "bell",
  },
  { id: "refunds", label: "Reembolsos", href: ACCOUNT_ROUTES.refunds, icon: "refund" },
];
