import { apiGet } from "@/services/http-client";

import type {
  ProductsSearchResponse,
  SearchGender,
  SearchModalResult,
  SearchQueryParams,
} from "@/features/search/types/search.types";

const DEFAULT_PER_PAGE = 4;

function filterGenders(genders: SearchGender[], query?: string) {
  if (!query?.trim()) return genders.slice(0, DEFAULT_PER_PAGE);

  const normalized = query.trim().toLowerCase();
  return genders
    .filter((gender) => gender.description.toLowerCase().includes(normalized))
    .slice(0, DEFAULT_PER_PAGE);
}

export async function getSearchModalData({
  q,
  perPage = DEFAULT_PER_PAGE,
}: SearchQueryParams): Promise<SearchModalResult> {
  const [productsResult, gendersResult] = await Promise.allSettled([
    apiGet<ProductsSearchResponse>("products", {
      params: {
        search: q,
        page: 1,
        perPage,
        sortBy: "name",
      },
    }),
    apiGet<SearchGender[]>("genders"),
  ]);

  const products =
    productsResult.status === "fulfilled" ? productsResult.value.data : [];

  const genders =
    gendersResult.status === "fulfilled"
      ? filterGenders(gendersResult.value, q)
      : [];

  return {
    products,
    genders,
    query: q ?? "",
  };
}
