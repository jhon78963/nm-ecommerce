import type { ProductSize } from "@/features/product/types/product-variant.types";

export type ProductStockStatus = "in_stock" | "out_of_stock";

export interface ProductBoxItem {
  id: number | string;
  slug: string;
  name: string;
  imageUrl: string;
  galleryImageUrls?: string[];
  price: number;
  salePrice: number;
  discount: number;
  ratingCount: number | null;
  reviewsCount: number;
  stockStatus: ProductStockStatus;
  href?: string;
  shortDescription?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isNew?: boolean;
  cashDiscount?: number;
  percentageDiscount?: number;
  /** Código de barras / SKU del producto cuando el catálogo lo expone. */
  sku?: string;
  /** Backend-pending: tallas y colores disponibles para el producto. */
  sizes?: ProductSize[];
}
