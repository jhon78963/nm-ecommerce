import { getProductsByIds } from "@/features/product/services/catalog.service";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";

export async function getWishlistProducts(ids: string[]): Promise<ProductBoxItem[]> {
  if (ids.length === 0) {
    return [];
  }

  const products = await getProductsByIds(ids);

  return ids
    .map((id) => products.find((product) => String(product.id) === id))
    .filter((product): product is ProductBoxItem => Boolean(product));
}
