import type { CartLineItem } from "@/features/cart/types/cart.types";
import type { ProductCartVariation } from "@/features/product/types/product-variant.types";
import type { ProductSize } from "@/features/product/types/product-variant.types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value?: string | null): value is string {
  return Boolean(value && UUID_PATTERN.test(value));
}

export function resolveCartLineVariantIds(item: CartLineItem): {
  productSizeId?: string;
  colorId?: string;
} {
  const productSizeId = isUuid(item.productSizeId)
    ? item.productSizeId
    : isUuid(item.variationId)
      ? item.variationId
      : undefined;

  const colorId = isUuid(item.colorId) ? item.colorId : undefined;

  return { productSizeId, colorId };
}

export function resolveCartVariationFromSizes(
  sizes: ProductSize[],
): ProductCartVariation | undefined {
  if (sizes.length !== 1) {
    return undefined;
  }

  const size = sizes[0];
  if (!isUuid(size.id)) {
    return undefined;
  }

  const colors = size.colors ?? [];

  if (colors.length === 1 && isUuid(colors[0].id)) {
    const variation = [size.label, colors[0].label].filter(Boolean).join(" — ");

    return {
      productSizeId: size.id,
      colorId: colors[0].id,
      variationId: size.id,
      variation: variation || undefined,
    };
  }

  if (colors.length === 0) {
    return {
      productSizeId: size.id,
      variationId: size.id,
      variation: size.label,
    };
  }

  return undefined;
}

export function cartLineHasValidVariant(
  item: Pick<CartLineItem, "productSizeId" | "variationId" | "colorId">,
): boolean {
  return Boolean(resolveCartLineVariantIds(item as CartLineItem).productSizeId);
}
