export const INSTITUTIONAL_SLUGS = [
  "nuestra-empresa",
  "tiendas",
  "preguntas-frecuentes",
  "contactanos",
  "terminos-y-condiciones",
  "libro-de-reclamaciones",
  "politica-de-privacidad",
  "politica-de-cookies",
  "garantia-y-devoluciones",
  "tarifas-y-zonas",
  "ventas-al-por-mayor",
] as const;

export type InstitutionalSlug = (typeof INSTITUTIONAL_SLUGS)[number];

export const INSTITUTIONAL_PAGE_META: Record<
  InstitutionalSlug,
  { title: string; description: string }
> = {
  "nuestra-empresa": {
    title: "Nuestra Empresa",
    description:
      "Conoce la historia, misión y valores de Novedades Maritex, más de 30 años vistiendo a familias peruanas.",
  },
  tiendas: {
    title: "Nuestras Tiendas",
    description:
      "Ubicaciones y horarios de nuestras tiendas en el Mercado Mayorista de Trujillo y Mercado Acomar.",
  },
  "preguntas-frecuentes": {
    title: "Preguntas Frecuentes",
    description: "Respuestas sobre compras, envíos, pagos y cambios en Novedades Maritex.",
  },
  contactanos: {
    title: "Contáctanos",
    description: "Teléfono, WhatsApp, correo y formulario de contacto de Novedades Maritex.",
  },
  "terminos-y-condiciones": {
    title: "Términos y Condiciones",
    description: "Condiciones de uso de la tienda online de Novedades Maritex.",
  },
  "libro-de-reclamaciones": {
    title: "Libro de Reclamaciones",
    description: "Libro de reclamaciones virtual conforme a INDECOPI.",
  },
  "politica-de-privacidad": {
    title: "Política de Privacidad",
    description: "Cómo recopilamos, usamos y protegemos tus datos personales.",
  },
  "politica-de-cookies": {
    title: "Política de Cookies",
    description: "Información sobre el uso de cookies en nuestro sitio web.",
  },
  "garantia-y-devoluciones": {
    title: "Políticas de Garantía y Devoluciones",
    description: "Cambios, devoluciones y garantía de productos Novedades Maritex.",
  },
  "tarifas-y-zonas": {
    title: "Tarifas y Zonas de Reparto",
    description: "Zonas de delivery en Trujillo y envíos a nivel nacional.",
  },
  "ventas-al-por-mayor": {
    title: "Ventas al Por Mayor",
    description: "Información para revendedores y compras mayoristas.",
  },
};

export function isInstitutionalSlug(slug: string): slug is InstitutionalSlug {
  return INSTITUTIONAL_SLUGS.includes(slug as InstitutionalSlug);
}

export function getInstitutionalPageMeta(slug: string) {
  if (!isInstitutionalSlug(slug)) {
    return null;
  }

  return INSTITUTIONAL_PAGE_META[slug];
}
