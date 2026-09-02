import type { CartLineItem } from "@/features/cart/types/cart.types";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import type { ProductCartVariation } from "@/features/product/types/product-variant.types";
import type { SearchProduct } from "@/features/search/types/search.types";
import { getProductMinPrice } from "@/features/search/utils/product";

export function productBoxItemToCartLineItem(
  product: ProductBoxItem,
  quantity = 1,
  variation?: ProductCartVariation,
): Omit<CartLineItem, "id"> {
  return {
    productId: String(product.id),
    name: product.name,
    imageUrl: product.imageUrl,
    quantity,
    price: product.salePrice,
    variation: variation?.variation,
    variationId: variation?.variationId,
  };
}

export function searchProductToCartLineItem(
  product: SearchProduct,
  quantity = 1,
): Omit<CartLineItem, "id"> {
  return {
    productId: product.id,
    name: product.name,
    imageUrl: "/placeholder-product.svg",
    quantity,
    price: getProductMinPrice(product),
  };
}
