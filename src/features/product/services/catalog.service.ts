import { env } from "@/config/env";
import type { PublicCatalogProductsResponse } from "@/features/product/types/catalog.types";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { mapPublicProductToProductBoxItem } from "@/features/product/utils/map-catalog-product";
import { apiGet } from "@/services/http-client";

export const CATALOG_REVALIDATE_SECONDS = 60;

export async function getProductsByIds(
  ids: Array<string | number>,
): Promise<ProductBoxItem[]> {
  const uniqueIds = [...new Set(ids.map(String).filter(Boolean))];

  if (uniqueIds.length === 0) {
    return [];
  }

  if (!env.storeWarehouseId) {
    return [];
  }

  try {
    const response = await apiGet<PublicCatalogProductsResponse>("ecommerce/products/public", {
      params: {
        ids: uniqueIds.join(","),
        warehouseId: env.storeWarehouseId,
      },
      revalidate: CATALOG_REVALIDATE_SECONDS,
    });

    return response.products.map(mapPublicProductToProductBoxItem);
  } catch {
    return [];
  }
}
