"use client";

import { useMemo, useState } from "react";

import { CART_COPY } from "@/features/cart/constants/cart-copy";
import { CartEmptyState } from "@/features/cart/components/CartEmptyState";
import { CartFooterActions } from "@/features/cart/components/CartFooterActions";
import { CartRow } from "@/features/cart/components/CartRow";
import { CartVariationEditModal } from "@/features/cart/components/CartVariationEditModal";
import { useCart } from "@/features/cart/context/CartProvider";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import { formatPrice } from "@/features/cart/utils/format-price";
import { buildWhatsAppPendingCartBatchUrl } from "@/features/cart/whatsapp-pending/build-whatsapp-cart-batch";
import { cartLineItemToWhatsAppPending } from "@/features/cart/whatsapp-pending/whatsapp-pending-cart.storage";

import "./cart.css";

export function CartTable() {
  const [editingLine, setEditingLine] = useState<CartLineItem | null>(null);
  const { items, subtotal, isHydrated, removeItem, updateQuantity } = useCart();
  const whatsappBatchUrl = useMemo(
    () =>
      buildWhatsAppPendingCartBatchUrl(items.map((line) => cartLineItemToWhatsAppPending(line))),
    [items],
  );

  if (!isHydrated) {
    return null;
  }

  if (items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <>
      <div className="table-responsive">
        <table className="cart-table">
          <thead>
            <tr className="table-head">
              <th scope="col">{CART_COPY.image}</th>
              <th scope="col">{CART_COPY.product}</th>
              <th scope="col">{CART_COPY.price}</th>
              <th scope="col">{CART_COPY.quantity}</th>
              <th scope="col">{CART_COPY.total}</th>
              <th scope="col">{CART_COPY.action}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <CartRow
                key={item.id}
                item={item}
                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                onRemove={() => removeItem(item.id)}
                onEditVariation={() => setEditingLine(item)}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="cart-tfoot-label cart-tfoot-label--desktop">
                {CART_COPY.totalPrice}:
              </td>
              <td className="cart-tfoot-label cart-tfoot-label--mobile">
                {CART_COPY.totalPrice}:
              </td>
              <td>
                <h2>{formatPrice(subtotal)}</h2>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="cart-buttons">
        <CartFooterActions whatsappHref={whatsappBatchUrl} variant="page" />
      </div>

      {editingLine ? (
        <CartVariationEditModal
          cartLine={editingLine}
          onClose={() => setEditingLine(null)}
        />
      ) : null}
    </>
  );
}
