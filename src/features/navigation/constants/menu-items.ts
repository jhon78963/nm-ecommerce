import type { NavMenuItem } from "@/features/navigation/types/navigation.types";

export const MAIN_NAV_ITEMS: NavMenuItem[] = [
  { id: "home", title: "Inicio", href: "/" },
  { id: "shop", title: "Tienda", href: "/tienda" },
  { id: "new", title: "Novedades", href: "/tienda?sort=new" },
  { id: "sale", title: "Ofertas", href: "/tienda?onSale=true" },
  { id: "contact", title: "Contacto", href: "/contacto" },
];
