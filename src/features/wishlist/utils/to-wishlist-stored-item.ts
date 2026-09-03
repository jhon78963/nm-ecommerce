import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import type { ProductCartVariation } from "@/features/product/types/product-variant.types";
import type { SearchProduct } from "@/features/search/types/search.types";
import { getProductMinPrice } from "@/features/search/utils/product";
import type { WishlistStoredItem } from "@/features/wishlist/types/wishlist.types";

type WishlistSourceProduct = SearchProduct | ProductBoxItem;

function resolvePrice(product: WishlistSourceProduct): number {
  if ("salePrice" in product && product.salePrice > 0) {
    return product.salePrice;
  }

  return getProductMinPrice({
    id: String(product.id),
    name: product.name,
    sizes: "sizes" in product ? product.sizes?.map((size) => ({
      id: size.id,
      salePrice: size.salePrice ?? 0,
      stock: size.stock ?? 0,
    })) : undefined,
  });
}

export function toWishlistStoredItem(
  product: WishlistSourceProduct,
  variant?: ProductCartVariation,
): WishlistStoredItem {
  return {
    productId: String(product.id),
    name: product.name,
    price: resolvePrice(product),
    imageUrl: "imageUrl" in product ? product.imageUrl : undefined,
    slug: "slug" in product ? product.slug : undefined,
    productSizeId: variant?.productSizeId,
    colorId: variant?.colorId,
    variation: variant?.variation,
    addedAt: new Date().toISOString(),
  };
}
