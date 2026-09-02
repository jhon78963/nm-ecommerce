import { apiGet } from "@/services/http-client";

import type { SearchProduct } from "@/features/search/types/search.types";

export async function getWishlistProducts(ids: string[]) {
  if (ids.length === 0) return [];

  const results = await Promise.allSettled(
    ids.map((id) => apiGet<SearchProduct>(`products/${id}`)),
  );

  return results
    .filter((result): result is PromiseFulfilledResult<SearchProduct> => result.status === "fulfilled")
    .map((result) => result.value);
}
