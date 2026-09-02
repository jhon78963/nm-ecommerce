import { env } from "@/config/env";
import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import type { PublicCatalogProductItem } from "@/features/product/types/catalog.types";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { mapPublicProductToProductBoxItem } from "@/features/product/utils/map-catalog-product";
import { apiGet } from "@/services/http-client";

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

  if (!warehouseId || !slug.trim()) {
    return null;
  }

  try {
    const product = await apiGet<PublicCatalogProductItem>(
      `ecommerce/products/public/by-slug/${encodeURIComponent(slug)}`,
      {
        params: { warehouseId },
        revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
      },
    );

    return mapPublicProductToProductBoxItem(product);
  } catch {
    return null;
  }
}
