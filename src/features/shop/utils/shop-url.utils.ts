import type { ReadonlyURLSearchParams } from "next/navigation";
import type {
  ParsedShopFilters,
  ShopActiveFilter,
  ShopProductsFacets,
  ShopSortOption,
} from "../types/shop.types";
import { SHOP_PER_PAGE } from "../constants/shop.constants";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function resolveFacetLabel(
  id: string,
  items: ShopProductsFacets["sizes"],
  genericLabel: string,
): string {
  const match = items.find((item) => item.id === id);
  if (match) return match.label;
  return UUID_PATTERN.test(id) ? genericLabel : id;
}

export function parseSearchParams(
  params: Record<string, string | string[] | undefined>,
): ParsedShopFilters {
  const raw = (key: string) => (Array.isArray(params[key]) ? params[key][0] : params[key]);

  return {
    sort: (raw("sort") as ShopSortOption) ?? "featured",
    page: Math.max(1, Number(raw("page") ?? 1)),
    minPrice: raw("minPrice") ? Number(raw("minPrice")) : undefined,
    maxPrice: raw("maxPrice") ? Number(raw("maxPrice")) : undefined,
    tallas: raw("tallas") ? raw("tallas")!.split(",").filter(Boolean) : [],
    colores: raw("colores") ? raw("colores")!.split(",").filter(Boolean) : [],
  };
}

export function buildFilterUrl(
  pathname: string,
  currentParams: ReadonlyURLSearchParams,
  update: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams(currentParams.toString());

  for (const [key, value] of Object.entries(update)) {
    if (value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
      if (key !== "page") params.delete("page");
    }
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function getActiveFilters(
  searchParams: ReadonlyURLSearchParams,
  facets: ShopProductsFacets,
): ShopActiveFilter[] {
  const filters: ShopActiveFilter[] = [];
  const min = searchParams.get("minPrice");
  const max = searchParams.get("maxPrice");

  if (min ?? max) {
    filters.push({ key: "price", label: `S/ ${min ?? "0"} – S/ ${max ?? "∞"}`, value: "" });
  }

  for (const sizeId of (searchParams.get("tallas") ?? "").split(",").filter(Boolean)) {
    filters.push({
      key: "tallas",
      label: resolveFacetLabel(sizeId, facets.sizes, "Talla"),
      value: sizeId,
    });
  }

  for (const colorId of (searchParams.get("colores") ?? "").split(",").filter(Boolean)) {
    filters.push({
      key: "colores",
      label: resolveFacetLabel(colorId, facets.colors, "Color"),
      value: colorId,
    });
  }

  return filters;
}

export function getPaginationInfo(totalCount: number, currentPage: number) {
  const totalPages = Math.ceil(totalCount / SHOP_PER_PAGE);
  const start = totalCount === 0 ? 0 : (currentPage - 1) * SHOP_PER_PAGE + 1;
  const end = Math.min(currentPage * SHOP_PER_PAGE, totalCount);
  return { totalPages, start, end };
}
