import { env } from "@/config/env";
import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import type { PublicCatalogProductItem } from "@/features/product/types/catalog.types";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { mapPublicProductToProductBoxItem } from "@/features/product/utils/map-catalog-product";
import { apiGet } from "@/services/http-client";
import { extractProductIdPrefixFromSlug, resolveProductSlug } from "@/utils/product-slug";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getProductsByIds(
  ids: Array<string | number>,
): Promise<ProductBoxItem[]> {
  const uniqueIds = [...new Set(ids.map(String).filter(Boolean))];

  if (uniqueIds.length === 0) {
    return [];
  }

  const warehouseId = env.storeWarehouseId;

  if (!warehouseId) {
    return [];
  }

  try {
    const response = await apiGet<{ products: PublicCatalogProductItem[] }>(
      "ecommerce/products/public",
      {
        params: {
          ids: uniqueIds.join(","),
          warehouseId,
        },
        revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
      },
    );

    return response.products.map(mapPublicProductToProductBoxItem);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<ProductBoxItem | null> {
  const warehouseId = env.storeWarehouseId;
  const normalizedSlug = slug.trim();

  if (!warehouseId || !normalizedSlug) {
    return null;
  }

  const requestOptions = {
    params: { warehouseId },
    revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
  } as const;

  // 1) Ruta pública ya permitida por el gateway: ?slug=
  try {
    const response = await apiGet<{ products: PublicCatalogProductItem[] }>(
      "ecommerce/products/public",
      {
        ...requestOptions,
        params: { ...requestOptions.params, slug: normalizedSlug },
      },
    );

    const product = response.products[0];
    if (product) {
      return mapPublicProductToProductBoxItem(product);
    }
  } catch {
    // Continúa con los fallbacks.
  }

  // 2) Endpoint dedicado by-slug (cuando el gateway lo exponga)
  try {
    const product = await apiGet<PublicCatalogProductItem>(
      `ecommerce/products/public/by-slug/${encodeURIComponent(normalizedSlug)}`,
      requestOptions,
    );

    return mapPublicProductToProductBoxItem(product);
  } catch {
    // Continúa con los fallbacks.
  }

  // 3) Slug UUID directo
  if (UUID_PATTERN.test(normalizedSlug)) {
    const products = await getProductsByIds([normalizedSlug]);
    return products[0] ?? null;
  }

  // 4) Slug SEO con sufijo de 8 chars — buscar en catálogo público del home
  const idPrefix = extractProductIdPrefixFromSlug(normalizedSlug);
  if (!idPrefix) {
    return null;
  }

  return findProductBySlugFromHomeCatalog(normalizedSlug, warehouseId);
}

async function findProductBySlugFromHomeCatalog(
  slug: string,
  _warehouseId: string,
): Promise<ProductBoxItem | null> {
  const idPrefix = extractProductIdPrefixFromSlug(slug);
  if (!idPrefix) {
    return null;
  }

  try {
    const [collectionsResponse, categoryResponse] = await Promise.all([
      apiGet<{ collections: Array<{ productIds: string[] }> }>("ecommerce/home/collections", {
        revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
      }),
      apiGet<{ section: { leftPanel?: { productIds: string[] }; rightPanel?: { productCategory?: { tabs?: Array<{ productIds: string[] }> } } } | null }>(
        "ecommerce/home/category-products",
        {
          revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
        },
      ),
    ]);

    const productIds = new Set<string>();

    for (const collection of collectionsResponse.collections ?? []) {
      for (const id of collection.productIds ?? []) {
        productIds.add(id);
      }
    }

    const section = categoryResponse.section;
    for (const id of section?.leftPanel?.productIds ?? []) {
      productIds.add(id);
    }

    for (const tab of section?.rightPanel?.productCategory?.tabs ?? []) {
      for (const id of tab.productIds ?? []) {
        productIds.add(id);
      }
    }

    if (productIds.size === 0) {
      return null;
    }

    const products = await getProductsByIds([...productIds]);
    return (
      products.find((product) => matchesProductSlug(product, slug, idPrefix)) ?? null
    );
  } catch {
    return null;
  }
}

function matchesProductSlug(
  product: ProductBoxItem,
  slug: string,
  idPrefix: string,
): boolean {
  const canonicalSlug = resolveProductSlug(product);

  return (
    canonicalSlug === slug
    || product.slug === slug
    || String(product.id).toLowerCase() === slug.toLowerCase()
    || String(product.id).toLowerCase().startsWith(idPrefix)
  );
}
