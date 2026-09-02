import type { ProductBoxItem } from "@/features/product/types/product-box.types";

export interface ProductCollectionConfig {
  id?: string;
  tag?: string;
  title: string;
  description?: string;
  status?: boolean;
  productIds?: Array<string | number>;
}

export interface HomeCollectionItem {
  id: string;
  tag?: string;
  title: string;
  description?: string;
  status: boolean;
  productIds: Array<string | number>;
}

export interface PublicCollectionsResponse {
  collections: HomeCollectionItem[];
}

export interface HomeCollectionView {
  id: string;
  tag?: string;
  title: string;
  description?: string;
  status: boolean;
  products: ProductBoxItem[];
}
