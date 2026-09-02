import type { SearchProduct } from "@/features/search/types/search.types";

export interface WishlistStoredItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  addedAt: string;
}

export type WishlistStockStatus = "in_stock" | "out_of_stock";

export interface WishlistContextValue {
  items: WishlistStoredItem[];
  itemCount: number;
  isHydrated: boolean;
  isInWishlist: (productId: string) => boolean;
  addItem: (product: SearchProduct) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: SearchProduct) => void;
  clearWishlist: () => void;
}
