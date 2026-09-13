import type { ProductBoxItem } from "@/features/product/types/product-box.types";

/** Alineado con Redis / STORE_CONTENT_REVALIDATE_SECONDS (300s en prod). */
const CACHE_TTL_MS = 300_000;

interface CacheEntry {
  product: ProductBoxItem;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<ProductBoxItem>>();

function cacheKey(productId: string): string {
  return String(productId);
}

function readEntry(productId: string): ProductBoxItem | null {
  const entry = memoryCache.get(cacheKey(productId));
  if (!entry) {
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(cacheKey(productId));
    return null;
  }
  return entry.product;
}

export function peekProductBoxItem(productId: string): ProductBoxItem | null {
  return readEntry(productId);
}

export function rememberProductBoxItem(product: ProductBoxItem): void {
  memoryCache.set(cacheKey(String(product.id)), {
    product,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

export function trackProductBoxItemRequest(
  productId: string,
  promise: Promise<ProductBoxItem>,
): Promise<ProductBoxItem> {
  const key = cacheKey(productId);
  inflight.set(key, promise);
  void promise.finally(() => {
    if (inflight.get(key) === promise) {
      inflight.delete(key);
    }
  });
  return promise;
}

export function getInflightProductBoxItem(productId: string): Promise<ProductBoxItem> | null {
  return inflight.get(cacheKey(productId)) ?? null;
}
