"use client";

import Link from "next/link";
import { Pencil, X } from "lucide-react";

import { StoreImage } from "@/components/ui/StoreImage";
import { CART_COPY } from "@/features/cart/constants/cart-copy";
import { CartQuantityStepper } from "@/features/cart/components/CartQuantityStepper";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import { cartLineIsEditable } from "@/features/cart/utils/cart-variant";
import { formatPrice } from "@/features/cart/utils/format-price";
import { getCartItemHref, getCartItemLineTotal } from "@/features/cart/utils/cart-item";

interface CartRowProps {
  item: CartLineItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
  onEditVariation?: () => void;
}

function CartRowActionButtons({
  showEdit,
  onEditVariation,
  onRemove,
}: {
  showEdit: boolean;
  onEditVariation?: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="cart-row-actions">
      {showEdit ? (
        <button
          type="button"
          onClick={onEditVariation}
          className="edit-btn"
          aria-label={CART_COPY.editVariation}
        >
          <Pencil className="size-4" />
        </button>
      ) : null}
      <button
        type="button"
        onClick={onRemove}
        className="remove-btn"
        aria-label={CART_COPY.removeItem}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function CartRow({
  item,
  onDecrease,
  onIncrease,
  onRemove,
  onEditVariation,
}: CartRowProps) {
  const href = getCartItemHref(item);
  const lineTotal = getCartItemLineTotal(item);
  const canEditVariation = cartLineIsEditable(item) && Boolean(onEditVariation);

  return (
    <tr>
      <td>
        <Link href={href} className="product-image-link">
          <StoreImage
            src={item.imageUrl}
            alt={item.name}
            width={90}
            height={90}
            className="cart-product-image"
          />
        </Link>
      </td>

      <td>
        <Link href={href} className="name">
          {item.name}
        </Link>
        {item.variation ? <p className="variation-label">{item.variation}</p> : null}

        <div className="mobile-cart-content">
          <div className="col">
            <CartQuantityStepper
              quantity={item.quantity}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              compact
            />
          </div>
          <div className="col table-price">
            <h2 className="td-color">{formatPrice(item.price)}</h2>
          </div>
          <div className="col">
            <h2 className="td-color">
              <CartRowActionButtons
                showEdit={canEditVariation}
                onEditVariation={onEditVariation}
                onRemove={onRemove}
              />
            </h2>
          </div>
        </div>
      </td>

      <td className="table-price">
        <h2>{formatPrice(item.price)}</h2>
      </td>

      <td>
        <CartQuantityStepper
          quantity={item.quantity}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </td>

      <td>
        <h2 className="td-color line-total">{formatPrice(lineTotal)}</h2>
      </td>

      <td>
        <CartRowActionButtons
          showEdit={canEditVariation}
          onEditVariation={onEditVariation}
          onRemove={onRemove}
        />
      </td>
    </tr>
  );
}
