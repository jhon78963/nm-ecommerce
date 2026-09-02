export const SITE_META = {
  siteTitle: "Novedades Maritex | Estilo y Variedad",
  siteTagline: "Las mejores tendencias y precios increíbles en un solo lugar.",
  description:
    "Descubre Novedades Maritex en el Mercado Mayorista de Trujillo (Puesto C-74). Ofrecemos ropa de moda, casual y de temporada para toda la familia con los mejores precios del mercado.",
  exitTaglineEnabled: true,
  taglines: ["⚡ ¡Te extrañamos!", "🎉 Ofertas para ti..."],
  messageDelayMs: 1000,
} as const;

export function getDefaultDocumentTitle() {
  return `${SITE_META.siteTitle} | ${SITE_META.siteTagline}`;
}
