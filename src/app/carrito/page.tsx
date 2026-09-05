import type { Metadata } from "next";

import { CartPage } from "@/features/cart/components/CartPage";
import { CART_COPY } from "@/features/cart/constants/cart-copy";
import { buildPrivatePageMetadata } from "@/features/seo/constants/site-meta";

export const metadata: Metadata = buildPrivatePageMetadata(
  `${CART_COPY.pageTitle} | Novedades Maritex`,
  CART_COPY.pageDescription,
);

export default function CarritoPage() {
  return <CartPage />;
}
