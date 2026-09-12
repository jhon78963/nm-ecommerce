"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";

import { useCart } from "@/features/cart/context/CartProvider";
import { CART_COPY } from "@/features/cart/constants/cart-copy";
import type { CartLineItem } from "@/features/cart/types/cart.types";
import { formatPrice } from "@/features/cart/utils/format-price";
import {
  cartLineHasValidVariant,
  resolveCartLineVariantIds,
} from "@/features/cart/utils/cart-variant";
import { ProductVariantSelectors } from "@/features/product/components/variants/ProductVariantSelectors";
import { useProductStock } from "@/features/product/hooks/use-product-stock";
import { useProductVariantSelection } from "@/features/product/hooks/use-product-variant-selection";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { fetchProductBoxItem } from "@/features/product/services/product-catalog.client";
import { enrichProductWithVariants } from "@/features/product/utils/enrich-product-variants";
import { clampQuantity, getVariantStock } from "@/features/product/utils/get-variant-stock";
import { getProductBoxHref } from "@/features/product/utils/format-product-price";
import { productBoxItemToCartLineItem } from "@/features/product/utils/to-cart-line-item";
import { cn } from "@/lib/utils";

import "@/features/product/components/quick-view/product-quick-view.css";
import "./cart-variation-edit-modal.css";

const MODAL_ANIMATION_MS = 360;

interface CartVariationEditModalProps {
  cartLine: CartLineItem;
  onClose: () => void;
}

export function CartVariationEditModal({ cartLine, onClose }: CartVariationEditModalProps) {
  const { replaceItem } = useCart();
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [isVisible, setIsVisible] = useState(false);
  const [product, setProduct] = useState<ProductBoxItem | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(cartLine.quantity);

  const lineVariant = resolveCartLineVariantIds(cartLine);
  const initialSelection = useMemo(
    () => ({
      sizeId: lineVariant.productSizeId ?? null,
      colorId: lineVariant.colorId ?? null,
    }),
    [lineVariant.colorId, lineVariant.productSizeId],
  );

  const enrichedProduct = useMemo(
    () => (product ? enrichProductWithVariants(product) : null),
    [product],
  );

  const { sizes: liveSizes } = useProductStock(
    String(cartLine.productId),
    enrichedProduct?.sizes ?? [],
  );

  const variantSelection = useProductVariantSelection(liveSizes, initialSelection, {
    productId: String(cartLine.productId),
    persist: false,
  });

  const availableStock = useMemo(
    () => getVariantStock(variantSelection.selectedSize, variantSelection.selectedColor),
    [variantSelection.selectedColor, variantSelection.selectedSize],
  );

  const maxQuantity = availableStock !== null && availableStock > 0 ? availableStock : 1;
  const effectiveQuantity = clampQuantity(quantity, maxQuantity);
  const canIncreaseQuantity = effectiveQuantity < maxQuantity;

  const displayPrice = variantSelection.selectedSize?.salePrice ?? product?.salePrice ?? cartLine.price;

  const canUpdate =
    Boolean(product)
    && (!variantSelection.hasSizes || Boolean(variantSelection.selectedSizeId))
    && cartLineHasValidVariant(
      productBoxItemToCartLineItem(product!, effectiveQuantity, variantSelection.cartVariation),
    )
    && (availableStock === null || (availableStock > 0 && effectiveQuantity <= availableStock));

  const handleClose = useCallback(() => {
    setIsVisible(false);
    window.setTimeout(onClose, MODAL_ANIMATION_MS);
  }, [onClose]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [isMounted]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const loaded = await fetchProductBoxItem(cartLine.productId);
        if (!cancelled) {
          setProduct(loaded);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : CART_COPY.productLoadError,
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cartLine.productId]);

  function updateQuantity(delta: number) {
    setQuantity((current) => clampQuantity(current + delta, maxQuantity));
  }

  function handleUpdate() {
    if (!product || !variantSelection.validate()) {
      return;
    }

    if (availableStock !== null && effectiveQuantity > availableStock) {
      return;
    }

    const nextLine = productBoxItemToCartLineItem(
      product,
      effectiveQuantity,
      variantSelection.cartVariation,
    );

    if (!cartLineHasValidVariant(nextLine)) {
      return;
    }

    replaceItem(cartLine.id, nextLine);
    handleClose();
  }

  if (!isMounted) {
    return null;
  }

  const productHref = product ? getProductBoxHref(product) : "#";

  return createPortal(
    <div
      className={cn(
        "quick-view-modal-root cart-variation-edit-modal-root theme-modal-2 variation-modal",
        isVisible && "quick-view-modal-root--show",
      )}
      role="presentation"
    >
      <button
        type="button"
        className="quick-view-modal-root__backdrop"
        onClick={handleClose}
        aria-label="Cerrar"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-variation-edit-title"
        className="quick-view-modal-root__dialog cart-variation-edit-modal__dialog"
      >
        <div className="modal-content cart-variation-edit-modal">
          <div className="modal-header p-0">
            <button
              type="button"
              className="btn btn-close"
              onClick={handleClose}
              aria-label="Cerrar"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="modal-body">
            {isLoading ? (
              <p className="cart-variation-edit-modal__status">{CART_COPY.loadingProduct}</p>
            ) : loadError ? (
              <p className="cart-variation-edit-modal__status">{loadError}</p>
            ) : product ? (
              <>
                <div className="product-right product-page-details variation-title">
                  <h2 className="main-title" id="cart-variation-edit-title">
                    <Link href={productHref} onClick={handleClose}>
                      {product.name}
                    </Link>
                  </h2>
                  <h3 className="price-detail">{formatPrice(displayPrice)}</h3>
                </div>

                {variantSelection.hasSizes ? (
                  <>
                    <ProductVariantSelectors
                      sizes={variantSelection.sizes}
                      selectedSizeId={variantSelection.selectedSizeId}
                      selectedColorId={variantSelection.selectedColorId}
                      selectedSize={variantSelection.selectedSize}
                      selectedColor={variantSelection.selectedColor}
                      availableColors={variantSelection.availableColors}
                      onSizeSelect={variantSelection.handleSizeSelect}
                      onColorSelect={variantSelection.handleColorSelect}
                    />

                    {variantSelection.validationError ? (
                      <p className="product-variant-selectors__error">
                        {variantSelection.validationError}
                      </p>
                    ) : null}
                  </>
                ) : null}

                <div className="variation-qty-button">
                  <div className="qty-section">
                    <div className="qty-box">
                      <div className="input-group">
                        <button
                          type="button"
                          className="btn quantity-left-minus"
                          onClick={() => updateQuantity(-1)}
                          aria-label={CART_COPY.decreaseQuantity}
                        >
                          <Minus className="size-4" />
                        </button>
                        <input
                          type="text"
                          name="quantity"
                          className="form-control input-number"
                          value={effectiveQuantity}
                          readOnly
                          aria-label={CART_COPY.quantity}
                        />
                        <button
                          type="button"
                          className="btn quantity-left-plus"
                          onClick={() => updateQuantity(1)}
                          disabled={!canIncreaseQuantity}
                          aria-label={CART_COPY.increaseQuantity}
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="product-buttons">
                    <button
                      type="button"
                      className="btn btn-solid hover-solid btn-animation scroll-button"
                      disabled={!canUpdate}
                      onClick={handleUpdate}
                    >
                      <ShoppingCart className="size-4" aria-hidden="true" />
                      {CART_COPY.updateItem}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
