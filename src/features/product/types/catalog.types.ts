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

export interface PublicCatalogProductColor {
  id: string;
  label: string;
  hex: string;
  stock: number;
}

export interface PublicCatalogProductSize {
  id: string;
  label: string;
  stock: number;
  salePrice: number;
  colors: PublicCatalogProductColor[];
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
  shortDescription?: string | null;
  description?: string | null;
  additionalInfo?: string | null;
  barcode?: string | null;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isNew?: boolean;
  percentageDiscount?: string | null;
  cashDiscount?: number | null;
  genderLabel?: string | null;
  sizes?: PublicCatalogProductSize[];
}

export interface PublicCatalogProductsResponse {
  products: PublicCatalogProductItem[];
}
