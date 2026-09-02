"use client";

import Link from "next/link";

import { CART_COPY } from "@/features/cart/constants/cart-copy";
import { CartEmptyState } from "@/features/cart/components/CartEmptyState";
import { CartRow } from "@/features/cart/components/CartRow";
import { useCart } from "@/features/cart/context/CartProvider";
import { formatPrice } from "@/features/cart/utils/format-price";
import { ROUTES } from "@/lib/routes";

import "./cart.css";

export function CartTable() {
  const { items, subtotal, isHydrated, removeItem, updateQuantity } = useCart();

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
        <Link href="/" className="cart-buttons__link">
          {CART_COPY.continueShopping}
        </Link>
        <Link href={ROUTES.checkout} className="cart-buttons__link">
          {CART_COPY.checkout}
        </Link>
      </div>
    </>
  );
}
