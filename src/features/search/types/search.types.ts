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

export interface SearchGender {
  id: string;
  description: string;
}

export interface ProductsSearchResponse {
  data: SearchProduct[];
  total: number;
  page: number;
  perPage: number;
}

export interface SearchModalResult {
  products: SearchProduct[];
  genders: SearchGender[];
  query: string;
}

export interface SearchQueryParams {
  q?: string;
  perPage?: number;
  genderId?: string;
}
