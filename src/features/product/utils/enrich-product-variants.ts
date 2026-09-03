import type { ProductSize } from "@/features/product/types/product-variant.types";

interface ProductWithOptionalSizes {
  sizes?: ProductSize[];
  salePrice: number;
}

export function enrichProductWithVariants<T extends ProductWithOptionalSizes>(
  product: T,
): T & { sizes: ProductSize[] } {
  return {
    ...product,
    sizes: product.sizes ?? [],
  };
}
