import type { ProductSize } from "@/features/product/types/product-variant.types";
import type { ProductStockResponse } from "@/features/product/types/product-stock.types";

export function mergeLiveStockIntoSizes(
  sizes: ProductSize[],
  stock: ProductStockResponse,
): ProductSize[] {
  const stockBySizeId = new Map(stock.sizes.map((size) => [size.id, size]));

  return sizes.map((size) => {
    const liveSize = stockBySizeId.get(size.id);
    if (!liveSize) {
      return size;
    }

    if (size.colors.length === 0) {
      return { ...size, stock: liveSize.stock };
    }

    const stockByColorId = new Map(liveSize.colors.map((color) => [color.id, color.stock]));

    return {
      ...size,
      stock: liveSize.stock,
      colors: size.colors.map((color) => ({
        ...color,
        stock: stockByColorId.get(color.id) ?? 0,
      })),
    };
  });
}
