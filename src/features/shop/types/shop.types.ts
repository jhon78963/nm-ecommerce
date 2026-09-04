import type { ProductBoxItem } from "@/features/product/types/product-box.types";

export type ShopSortOption = "featured" | "price_asc" | "price_desc" | "newest";

export interface ShopCollection {
  slug: string;
  label: string;
  description?: string;
  bannerImageUrl?: string;
}

export interface ShopSidebarFilter {
  id: string;
  label: string;
  hex?: string;
}

export interface ShopActiveFilter {
  key: string;
  label: string;
  value: string;
}

export interface ParsedShopFilters {
  sort: ShopSortOption;
  page: number;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  tallas: string[];
  colores: string[];
  q: string;
  onSale: boolean;
}

export interface ShopProductsFacets {
  sizes: ShopSidebarFilter[];
  colors: ShopSidebarFilter[];
}

export interface ShopProductsResult {
  products: ProductBoxItem[];
  totalCount: number;
  facets: ShopProductsFacets;
}

export interface ShopPageProps {
  collection: ShopCollection;
  collections: ShopCollection[];
  products: ProductBoxItem[];
  totalCount: number;
  currentPage: number;
  facets: ShopProductsFacets;
}
