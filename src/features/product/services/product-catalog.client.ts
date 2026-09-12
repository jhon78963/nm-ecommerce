import type { ProductBoxItem } from "@/features/product/types/product-box.types";

export async function fetchProductBoxItem(productId: string): Promise<ProductBoxItem> {
  const response = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "No se pudo cargar el producto.");
  }

  const data = (await response.json()) as { product: ProductBoxItem };
  return data.product;
}
