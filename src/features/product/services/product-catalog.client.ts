import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import {
  getInflightProductBoxItem,
  peekProductBoxItem,
  rememberProductBoxItem,
  trackProductBoxItemRequest,
} from "@/features/product/services/product-box-item-cache";

async function loadProductBoxItem(productId: string): Promise<ProductBoxItem> {
  const response = await fetch(`/api/products/${encodeURIComponent(productId)}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "No se pudo cargar el producto.");
  }

  const data = (await response.json()) as { product: ProductBoxItem };
  rememberProductBoxItem(data.product);
  return data.product;
}

/** Lectura instantánea si ya se cargó en esta sesión (p. ej. quick view o edit previo). */
export { peekProductBoxItem } from "@/features/product/services/product-box-item-cache";

/** Precarga en segundo plano (hover del lápiz en carrito). */
export function prefetchProductBoxItem(productId: string): void {
  const id = String(productId);
  if (peekProductBoxItem(id) || getInflightProductBoxItem(id)) {
    return;
  }
  trackProductBoxItemRequest(id, loadProductBoxItem(id)).catch(() => {
    /* ignore prefetch errors */
  });
}

export async function fetchProductBoxItem(productId: string): Promise<ProductBoxItem> {
  const id = String(productId);
  const cached = peekProductBoxItem(id);
  if (cached) {
    return cached;
  }

  const pending = getInflightProductBoxItem(id);
  if (pending) {
    return pending;
  }

  return trackProductBoxItemRequest(id, loadProductBoxItem(id));
}
