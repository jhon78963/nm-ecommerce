import type { StoreFooterConfig } from "@/features/footer/types/footer.types";
import { SUPPORT_EMAIL } from "@/features/institutional/constants/support-contact";

export const FOOTER_REVALIDATE_SECONDS = 300;

/** Valores por defecto del footer (alineados con ecommerce-service). */
export const FALLBACK_FOOTER_CONFIG: StoreFooterConfig = {
  newsletterTitle: "¡Suscríbete ahora!",
  newsletterSubtitle:
    "Regístrate en nuestro Newsletter y recibe ofertas, promociones y lanzamientos.",
  aboutText:
    "Descubre las últimas tendencias y disfruta de una experiencia de compra única con nuestras colecciones exclusivas.",
  address: "Puesto C-74, Mercado Mayorista, Trujillo, Perú",
  supportNumber: "+51 901259663",
  supportEmail: SUPPORT_EMAIL,
  socialMediaEnabled: true,
  facebookUrl: "https://facebook.com/",
  twitterUrl: "https://twitter.com/",
  instagramUrl: "https://instagram.com/",
  pinterestUrl: "https://pinterest.com/",
  tiktokUrl: "https://www.tiktok.com/",
  categories: [
    { id: "nosotros-1", name: "Nuestra Empresa", href: "/nuestra-empresa" },
    { id: "nosotros-2", name: "Nuestras Tiendas", href: "/tiendas" },
    { id: "nosotros-3", name: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
    { id: "nosotros-4", name: "Contactanos", href: "/contactanos" },
  ],
  usefulLinks: [
    { id: "info-1", name: "Términos y condiciones", href: "/terminos-y-condiciones" },
    { id: "info-2", name: "Libro de reclamaciones", href: "/libro-de-reclamaciones" },
    { id: "info-3", name: "Política de privacidad", href: "/politica-de-privacidad" },
    { id: "info-4", name: "Política de cookies", href: "/politica-de-cookies" },
  ],
  helpCenterLinks: [
    {
      id: "help-1",
      name: "Políticas de garantía y devoluciones",
      href: "/garantia-y-devoluciones",
    },
    { id: "help-2", name: "Tarifas y zonas de reparto", href: "/tarifas-y-zonas" },
    { id: "help-3", name: "Ventas al por mayor", href: "/ventas-al-por-mayor" },
  ],
  copyrightEnabled: true,
  copyrightContent: "2026 NovedadesMaritex © Todos los derechos reservados.",
  paymentImageUrl: "/images/theme/data/payments.png",
};
