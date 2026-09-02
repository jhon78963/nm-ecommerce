import { ROUTES } from "@/lib/routes";

import type { StoreFooterConfig } from "@/features/footer/types/footer.types";

export const FOOTER_REVALIDATE_SECONDS = 300;

/** themeOptions.json → footer (adaptado a rutas nm-ecommerce) */
export const FALLBACK_FOOTER_CONFIG: StoreFooterConfig = {
  newsletterTitle: "KNOW IT ALL FIRST!",
  newsletterSubtitle: "Never Miss Anything From Store By Signing Up To Our Newsletter.",
  aboutText:
    "Discover the latest trends and enjoy seamless shopping with our exclusive collections.",
  address: "Puesto C-74, Mercado Mayorista, Trujillo, Perú",
  supportNumber: "+51 984802248",
  supportEmail: "novedadesmaritex@gmail.com",
  socialMediaEnabled: true,
  facebookUrl: "https://facebook.com/",
  twitterUrl: "https://twitter.com/",
  instagramUrl: "https://instagram.com/",
  pinterestUrl: "https://pinterest.com/",
  tiktokUrl: "https://www.tiktok.com/",
  categories: [
    { id: "500", name: "Baby Essentials", href: `${ROUTES.shop}?categoria=baby-essentials` },
    { id: "520", name: "Bag Emporium", href: `${ROUTES.shop}?categoria=bag-emporium` },
    { id: "540", name: "Books", href: `${ROUTES.shop}?categoria=books` },
    { id: "560", name: "Christmas", href: `${ROUTES.shop}?categoria=christmas` },
    { id: "580", name: "Classic Furnishings", href: `${ROUTES.shop}?categoria=classic-furnishings` },
  ],
  usefulLinks: [
    { id: "1", name: "Home", href: "/" },
    { id: "3", name: "About Us", href: "/acerca-de-nosotros" },
    { id: "5", name: "Offers", href: ROUTES.shop },
  ],
  helpCenterLinks: [
    { id: "1", name: "My Account", href: "/micuenta/miperfil" },
    { id: "2", name: "My Orders", href: "/micuenta/pedidos" },
    { id: "4", name: "Wishlist", href: ROUTES.favorites },
    { id: "6", name: "Faq's", href: "/preguntas-frecuentes" },
    { id: "7", name: "Contact Us", href: "/contactanos" },
  ],
  copyrightEnabled: true,
  copyrightContent: "2026 NovedadesMaritex © Todos los derechos reservados.",
  paymentImageUrl: "/images/theme/data/payments.png",
};
