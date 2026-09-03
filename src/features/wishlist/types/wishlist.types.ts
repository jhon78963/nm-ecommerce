import type { ProductCartVariation } from "@/features/product/types/product-variant.types";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import type { SearchProduct } from "@/features/search/types/search.types";

export interface WishlistStoredItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  slug?: string;
  productSizeId?: string;
  colorId?: string;
  variation?: string;
  addedAt: string;
}

export type WishlistStockStatus = "in_stock" | "out_of_stock";

export type WishlistProductInput = SearchProduct | ProductBoxItem;

export interface WishlistContextValue {
  items: WishlistStoredItem[];
  itemCount: number;
  isHydrated: boolean;
  isInWishlist: (productId: string) => boolean;
  addItem: (product: WishlistProductInput, variant?: ProductCartVariation) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: WishlistProductInput, variant?: ProductCartVariation) => void;
  clearWishlist: () => void;
}
