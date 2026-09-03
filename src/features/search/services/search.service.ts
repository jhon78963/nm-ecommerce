import { mapPublicProductToProductBoxItem } from "@/features/product/utils/map-catalog-product";
import { getStoreWarehouseId, proxyEcommerceJson } from "@/lib/ecommerce-backend";

import type {
  SearchModalResult,
  SearchQueryParams,
  StoreSearchApiResponse,
} from "@/features/search/types/search.types";

const DEFAULT_PER_PAGE = 4;

function toLegacyGenders(
  collections: StoreSearchApiResponse["collections"],
): SearchModalResult["genders"] {
  return collections.map((collection) => ({
    id: collection.id,
    description: collection.label,
  }));
}

export async function getSearchModalData({
  q,
  perPage = DEFAULT_PER_PAGE,
}: SearchQueryParams): Promise<SearchModalResult> {
  const warehouseId = getStoreWarehouseId();
  const params = new URLSearchParams({
    warehouseId,
    perPage: String(perPage),
  });

  if (q?.trim()) {
    params.set("q", q.trim());
  }

  const response = await proxyEcommerceJson(`/ecommerce/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Search request failed: ${response.status}`);
  }

  const data = (await response.json()) as StoreSearchApiResponse;
  const collections = data.collections ?? [];

  return {
    products: (data.products ?? []).map(mapPublicProductToProductBoxItem),
    collections,
    genders: toLegacyGenders(collections),
    query: data.query ?? q ?? "",
  };
}
