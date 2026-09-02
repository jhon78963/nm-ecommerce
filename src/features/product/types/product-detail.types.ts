import type { ProductBoxItem } from "@/features/product/types/product-box.types";

export interface ProductDetailColor {
  id: string;
  label: string;
  hex: string;
}

export interface ProductDetailSize {
  id: string;
  label: string;
  stock: number;
  /** Overrides the base price when this size has a different price point. */
  salePrice?: number;
  colors: ProductDetailColor[];
}

/**
 * Rich product type used exclusively in the Product Detail Page.
 * Extends the base ProductBoxItem with fields that the PDP API will provide.
 * Fields marked optional are backend-pending and rendered with stub data
 * during UI development.
 */
export interface ProductDetail extends ProductBoxItem {
  description?: string;
  sku?: string;
  genderLabel?: string;
  /** Backend-pending: populated once the ecommerce-service endpoint expands. */
  sizes?: ProductDetailSize[];
}
