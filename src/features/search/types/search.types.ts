import type { ProductBoxItem } from "@/features/product/types/product-box.types";

export interface ProductSize {
  id: string;
  salePrice: number;
  stock: number;
  size?: { id: string; description: string };
  colors?: { id: string; description: string }[];
}

export interface SearchProduct {
  id: string;
  name: string;
  barcode?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  status?: string;
  sizes?: ProductSize[];
}

export interface SearchCollection {
  id: string;
  slug: string;
  label: string;
}

/** @deprecated Usar SearchCollection — se mantiene por compatibilidad temporal. */
export interface SearchGender {
  id: string;
  description: string;
}

export interface SearchModalResult {
  products: ProductBoxItem[];
  collections: SearchCollection[];
  /** @deprecated Usar collections */
  genders: SearchGender[];
  query: string;
}

export interface SearchQueryParams {
  q?: string;
  perPage?: number;
}

export interface StoreSearchApiResponse {
  query: string;
  collections: SearchCollection[];
  products: Array<{
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    galleryImageUrls: string[];
    price: number;
    salePrice: number;
    discount: number;
    stockStatus: "in_stock" | "out_of_stock";
    ratingCount: number | null;
    reviewsCount: number;
    shortDescription?: string | null;
    description?: string | null;
    isFeatured?: boolean;
    isOnSale?: boolean;
    isNew?: boolean;
    percentageDiscount?: string | null;
    cashDiscount?: number | null;
    sizes?: Array<{
      id: string;
      label: string;
      stock: number;
      salePrice: number;
      colors: Array<{
        id: string;
        label: string;
        hex: string;
        stock: number;
      }>;
    }>;
  }>;
}
