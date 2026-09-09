import type { ProductStockResponse } from "@/features/product/types/product-stock.types";

export async function fetchProductStock(productId: string): Promise<ProductStockResponse> {
  const response = await fetch(`/api/products/${encodeURIComponent(productId)}/stock`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "No se pudo consultar el stock.");
  }

  return (await response.json()) as ProductStockResponse;
}
