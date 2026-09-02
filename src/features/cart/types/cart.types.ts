export interface CartLineItem {
  id: string;
  productId: string;
  productSizeId?: string;
  colorId?: string;
  slug?: string;
  name: string;
  imageUrl?: string;
  quantity: number;
  price: number;
  variation?: string;
  /** @deprecated Use productSizeId + colorId */
  variationId?: string;
}

export interface CartState {
  items: CartLineItem[];
  isOpen: boolean;
  freeShippingThreshold: number;
}

export interface CartContextValue extends CartState {
  isHydrated: boolean;
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: (open: boolean) => void;
  clearCart: () => void;
  addItem: (item: Omit<CartLineItem, "id"> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}
