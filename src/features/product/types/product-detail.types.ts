import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import type { ProductColor, ProductSize } from "@/features/product/types/product-variant.types";

export type { ProductColor, ProductSize };

/**
 * Rich product type used exclusively in the Product Detail Page.
 * Extends the base ProductBoxItem with fields that the PDP API will provide.
 */
export interface ProductDetail extends ProductBoxItem {
  description?: string;
  sku?: string;
  genderLabel?: string;
}
