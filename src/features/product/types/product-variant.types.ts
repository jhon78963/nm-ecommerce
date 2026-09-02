export interface ProductColor {
  id: string;
  label: string;
  hex: string;
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
  variationId?: string;
}
