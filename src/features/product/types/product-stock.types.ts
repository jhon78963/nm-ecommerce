export interface ProductStockColor {
  id: string;
  stock: number;
}

export interface ProductStockSize {
  id: string;
  stock: number;
  colors: ProductStockColor[];
}

export interface ProductStockResponse {
  productId: string;
  stockStatus: "in_stock" | "out_of_stock";
  sizes: ProductStockSize[];
}
