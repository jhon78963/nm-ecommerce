import type { ProductVariantInitialSelection } from "@/features/product/hooks/use-product-variant-selection";

export const VARIANT_PARAM_SIZE = "talla";
export const VARIANT_PARAM_COLOR = "color";

export function buildProductHrefWithVariants(
  baseHref: string,
  variant?: ProductVariantInitialSelection,
): string {
  if (!variant?.sizeId && !variant?.colorId) {
    return baseHref;
  }

  const params = new URLSearchParams();

  if (variant.sizeId) {
    params.set(VARIANT_PARAM_SIZE, variant.sizeId);
  }

  if (variant.colorId) {
    params.set(VARIANT_PARAM_COLOR, variant.colorId);
  }

  const query = params.toString();
  return query ? `${baseHref}?${query}` : baseHref;
}

function readParam(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  if (searchParams instanceof URLSearchParams) {
    return searchParams.get(key) ?? undefined;
  }

  const value = searchParams[key];
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}

export function parseVariantSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): ProductVariantInitialSelection {
  return {
    sizeId: readParam(searchParams, VARIANT_PARAM_SIZE),
    colorId: readParam(searchParams, VARIANT_PARAM_COLOR),
  };
}
