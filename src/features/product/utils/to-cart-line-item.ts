import type { CartLineItem } from "@/features/cart/types/cart.types";
import {
  isUuid,
  resolveCartLineVariantIds,
  resolveCartVariationFromSizes,
} from "@/features/cart/utils/cart-variant";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import type { ProductCartVariation } from "@/features/product/types/product-variant.types";
import type { ProductSize } from "@/features/product/types/product-variant.types";
import type { SearchProduct } from "@/features/search/types/search.types";
import { getProductMinPrice } from "@/features/search/utils/product";

function resolveVariation(
  product: Pick<ProductBoxItem, "sizes">,
  variation?: ProductCartVariation,
): ProductCartVariation | undefined {
  if (variation?.productSizeId && isUuid(variation.productSizeId)) {
    return variation;
  }

  if (product.sizes?.length) {
    return resolveCartVariationFromSizes(product.sizes) ?? variation;
  }

  return variation;
}

export function productBoxItemToCartLineItem(
  product: ProductBoxItem,
  quantity = 1,
  variation?: ProductCartVariation,
): Omit<CartLineItem, "id"> {
  const resolvedVariation = resolveVariation(product, variation);

  return {
    productId: String(product.id),
    productSizeId: resolvedVariation?.productSizeId,
    colorId: resolvedVariation?.colorId,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    quantity,
    price: product.salePrice,
    variation: resolvedVariation?.variation,
    variationId: resolvedVariation?.variationId,
  };
}

function mapSearchSizesToProductSizes(
  sizes: NonNullable<SearchProduct["sizes"]>,
): ProductSize[] {
  return sizes.map((size) => ({
    id: size.id,
    label: size.size?.description ?? size.id,
    stock: size.stock,
    salePrice: size.salePrice,
    colors: (size.colors ?? []).map((color) => ({
      id: color.id,
      label: color.description,
      hex: "#CCCCCC",
    })),
  }));
}

export function searchProductToCartLineItem(
  product: SearchProduct,
  quantity = 1,
): Omit<CartLineItem, "id"> {
  const sizes = product.sizes ?? [];
  const resolvedVariation =
    sizes.length > 0 ? resolveCartVariationFromSizes(mapSearchSizesToProductSizes(sizes)) : undefined;

  return {
    productId: product.id,
    productSizeId: resolvedVariation?.productSizeId,
    colorId: resolvedVariation?.colorId,
    name: product.name,
    imageUrl: "/placeholder-product.svg",
    quantity,
    price: getProductMinPrice(product),
    variation: resolvedVariation?.variation,
    variationId: resolvedVariation?.variationId,
  };
}
