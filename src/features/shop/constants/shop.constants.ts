import type { ShopCollection } from "../types/shop.types";

export const SHOP_PER_PAGE = 12;

/** Colección virtual global — siempre disponible, no requiere configuración en admin. */
export const SEARCH_COLLECTION_SLUG = "search";

export const SEARCH_COLLECTION: ShopCollection = {
  slug: SEARCH_COLLECTION_SLUG,
  label: "Búsqueda",
  description: "Resultados de búsqueda en toda la tienda",
};

export const SHOP_SORT_OPTIONS = [
  { value: "featured", label: "Relevancia" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "newest", label: "Más nuevos" },
] as const;

/** Fallback offline — debe coincidir con defaults del ecommerce-service. */
export const FALLBACK_SHOP_COLLECTIONS: ShopCollection[] = [
  { slug: "ninos", label: "Niños" },
  { slug: "jovenes", label: "Jovenes" },
  { slug: "senoritas", label: "Señoritas" },
  { slug: "adulto-mayor", label: "Adulto mayor" },
  { slug: "deporte", label: "Deporte" },
  { slug: "ofertas", label: "Ofertas" },
];

export function toCollectionSlug(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

const COLLECTION_SLUG_ALIASES: Record<string, string> = {
  joven: "jovenes",
  nino: "ninos",
  senorita: "senoritas",
};

export function resolveCollectionSlug(label: string): string {
  const normalized = toCollectionSlug(label);

  const bySlug = FALLBACK_SHOP_COLLECTIONS.find((collection) => collection.slug === normalized);
  if (bySlug) return bySlug.slug;

  const byLabel = FALLBACK_SHOP_COLLECTIONS.find(
    (collection) => toCollectionSlug(collection.label) === normalized,
  );
  if (byLabel) return byLabel.slug;

  return COLLECTION_SLUG_ALIASES[normalized] ?? normalized;
}
