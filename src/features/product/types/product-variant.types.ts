export interface ProductColor {
  id: string;
  label: string;
  hex: string;
  stock: number;
}

export interface ProductSize {
  id: string;
  label: string;
  stock: number;
  salePrice?: number;
  colors: ProductColor[];
}

export interface ProductCartVariation {
  variation?: string;
  productSizeId?: string;
  colorId?: string;
  /** @deprecated Use productSizeId + colorId */
  variationId?: string;
}
