import type { ProductStockResponse } from "@/features/product/types/product-stock.types";
import { getStoreWarehouseId, proxyEcommerceJson, readUpstreamError } from "@/lib/ecommerce-backend";

export async function fetchProductStockFromBackend(
  productId: string,
): Promise<ProductStockResponse> {
  const warehouseId = getStoreWarehouseId();
  const response = await proxyEcommerceJson(
    `/ecommerce/products/${encodeURIComponent(productId)}/stock?warehouseId=${encodeURIComponent(warehouseId)}`,
  );

  if (!response.ok) {
    throw new Error(await readUpstreamError(response));
  }

  return (await response.json()) as ProductStockResponse;
}
