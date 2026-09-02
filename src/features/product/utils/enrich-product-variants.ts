import { STUB_PRODUCT_SIZES } from "@/features/product/constants/pdp-stubs";
import type { ProductSize } from "@/features/product/types/product-variant.types";

interface ProductWithOptionalSizes {
  sizes?: ProductSize[];
  salePrice: number;
}

export function enrichProductWithVariants<T extends ProductWithOptionalSizes>(
  product: T,
): T & { sizes: ProductSize[] } {
  if (product.sizes && product.sizes.length > 0) {
    return product as T & { sizes: ProductSize[] };
  }

  return {
    ...product,
    sizes: STUB_PRODUCT_SIZES.map((size) => ({
      ...size,
      salePrice: product.salePrice,
    })),
  };
}
