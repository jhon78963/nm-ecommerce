import type { Metadata } from "next";

import { CartPage } from "@/features/cart/components/CartPage";
import { CART_COPY } from "@/features/cart/constants/cart-copy";

export const metadata: Metadata = {
  title: `${CART_COPY.pageTitle} | Novedades Maritex`,
  description: CART_COPY.pageDescription,
};

export default function CarritoPage() {
  return <CartPage />;
}
