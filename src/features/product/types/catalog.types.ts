export interface CatalogProductSize {
  id: string;
  salePrice: number;
  stock: number;
  size?: { id: string; description: string };
  colors?: Array<{ id: string; description: string }>;
}

export interface CatalogProduct {
  id: string;
  name: string;
  barcode?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  status?: string;
  sizes?: CatalogProductSize[];
}

export interface PublicCatalogProductItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  galleryImageUrls: string[];
  price: number;
  salePrice: number;
  discount: number;
  stockStatus: "in_stock" | "out_of_stock";
  ratingCount: null;
  reviewsCount: number;
}

export interface PublicCatalogProductsResponse {
  products: PublicCatalogProductItem[];
}
