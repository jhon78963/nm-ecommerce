import type { FooterCategoryItem, FooterLinkItem } from "@/features/footer/types/footer.types";

/** Enlaces del footer (hardcodeados, alineados con nm-wordpress). */
export const HARDCODED_FOOTER_NOSOTROS_LINKS: FooterCategoryItem[] = [
  { id: "nosotros-1", name: "Nuestra Empresa", href: "/nuestra-empresa" },
  { id: "nosotros-2", name: "Nuestras Tiendas", href: "/tiendas" },
  { id: "nosotros-3", name: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
  { id: "nosotros-4", name: "Contactanos", href: "/contactanos" },
];

export const HARDCODED_FOOTER_INFORMACION_LINKS: FooterLinkItem[] = [
  { id: "info-1", name: "Términos y condiciones", href: "/terminos-y-condiciones" },
  { id: "info-2", name: "Libro de reclamaciones", href: "/libro-de-reclamaciones" },
  { id: "info-3", name: "Política de privacidad", href: "/politica-de-privacidad" },
  { id: "info-4", name: "Política de cookies", href: "/politica-de-cookies" },
];

export const HARDCODED_FOOTER_CENTRO_AYUDA_LINKS: FooterLinkItem[] = [
  {
    id: "help-1",
    name: "Políticas de garantía y devoluciones",
    href: "/garantia-y-devoluciones",
  },
  { id: "help-2", name: "Tarifas y zonas de reparto", href: "/tarifas-y-zonas" },
  { id: "help-3", name: "Ventas al por mayor", href: "/ventas-al-por-mayor" },
];
