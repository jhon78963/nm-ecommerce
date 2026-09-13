"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, X } from "lucide-react";

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
import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { fetchProductBoxItem, peekProductBoxItem } from "@/features/product/services/product-catalog.client";
import { enrichProductWithVariants } from "@/features/product/utils/enrich-product-variants";
import { clampQuantity, getVariantStock } from "@/features/product/utils/get-variant-stock";
import { getProductBoxHref } from "@/features/product/utils/format-product-price";
import { productBoxItemToCartLineItem } from "@/features/product/utils/to-cart-line-item";
import { cn } from "@/lib/utils";

import "@/features/product/components/quick-view/product-quick-view.css";
import "./cart-variation-edit-modal.css";

const MODAL_ANIMATION_MS = 360;

type CartVariationEditPresentation = "default" | "offcanvas";

interface CartVariationEditModalProps {
  cartLine: CartLineItem;
  onClose: () => void;
  presentation?: CartVariationEditPresentation;
}

export function CartVariationEditModal({
  cartLine,
  onClose,
  presentation = "default",
}: CartVariationEditModalProps) {
  const isOffcanvas = presentation === "offcanvas";
  const { replaceItem } = useCart();
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [isVisible, setIsVisible] = useState(false);
  const [product, setProduct] = useState<ProductBoxItem | null>(() =>
    peekProductBoxItem(cartLine.productId),
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(() => !peekProductBoxItem(cartLine.productId));
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

  const displayPrice =
    variantSelection.selectedSize?.salePrice ?? product?.salePrice ?? cartLine.price;
  const previewImageUrl = product?.imageUrl ?? cartLine.imageUrl;
  const displayName = product?.name ?? cartLine.name;
  const showFooter = isOffcanvas ? !loadError : Boolean(product) && !isLoading && !loadError;

  const canUpdate =
    Boolean(product)
    && (!variantSelection.hasSizes || Boolean(variantSelection.selectedSizeId))
    && cartLineHasValidVariant(
      productBoxItemToCartLineItem(product!, effectiveQuantity, variantSelection.cartVariation),
    )
    && (availableStock === null || (availableStock > 0 && effectiveQuantity <= availableStock));

  const updateLabel = isOffcanvas ? CART_COPY.updateItemShort : CART_COPY.updateItem;

  const stockHint = useMemo(() => {
    if (availableStock === null) {
      return null;
    }
    if (availableStock <= 0) {
      return PDP_COPY.outOfStock;
    }
    if (availableStock <= 4) {
      return PDP_COPY.remainingStock(availableStock);
    }
    return null;
  }, [availableStock]);

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
        isOffcanvas && "cart-variation-edit-modal-root--offcanvas",
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
        <div
          className={cn(
            "modal-content cart-variation-edit-modal",
            isOffcanvas && "cart-variation-edit-modal--offcanvas",
          )}
        >
          {isOffcanvas ? (
            <div className="cart-variation-edit-modal__topbar">
              <button
                type="button"
                className="cart-variation-edit-modal__back"
                onClick={handleClose}
                aria-label="Volver al carrito"
              >
                <ArrowLeft className="size-4" aria-hidden />
                {CART_COPY.editVariationTitle}
              </button>
              <button
                type="button"
                className="cart-variation-edit-modal__topbar-close"
                onClick={handleClose}
                aria-label="Cerrar"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
          ) : (
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
          )}

          <div className="cart-variation-edit-modal__body modal-body">
            {loadError ? (
              <p className="cart-variation-edit-modal__status">{loadError}</p>
            ) : (
              <>
                <div
                  className={cn(
                    "cart-variation-edit-modal__product",
                    isOffcanvas && "cart-variation-edit-modal__product--offcanvas",
                  )}
                >
                  <div
                    className={cn(
                      "cart-variation-edit-modal__thumb",
                      isOffcanvas && "cart-variation-edit-modal__thumb--offcanvas",
                    )}
                  >
                    {previewImageUrl ? (
                      <Image
                        src={previewImageUrl}
                        alt={displayName}
                        fill
                        className="object-contain p-1"
                        sizes={isOffcanvas ? "140px" : "96px"}
                      />
                    ) : (
                      <ShoppingCart className="size-6 text-[#ccc]" aria-hidden />
                    )}
                  </div>

                  <div className="cart-variation-edit-modal__product-copy">
                    <p className="cart-variation-edit-modal__eyebrow">
                      {isOffcanvas ? CART_COPY.editVariationCurrent : CART_COPY.editVariation}
                    </p>
                    <h2 className="main-title" id="cart-variation-edit-title">
                      {product ? (
                        <Link href={productHref} onClick={handleClose}>
                          {displayName}
                        </Link>
                      ) : (
                        displayName
                      )}
                    </h2>
                    <p className="price-detail">{formatPrice(displayPrice)}</p>
                    {cartLine.variation ? (
                      <p className="cart-variation-edit-modal__current-line">{cartLine.variation}</p>
                    ) : null}
                  </div>
                </div>

                <div
                  className={cn(
                    "cart-variation-edit-modal__variant-panel",
                    isOffcanvas && "cart-variation-edit-modal__variant-panel--offcanvas",
                  )}
                >
                  <p className="cart-variation-edit-modal__panel-title">{CART_COPY.chooseVariation}</p>

                  {isLoading ? (
                    <div className="cart-variation-edit-modal__skeleton" aria-hidden>
                      <div className="cart-variation-edit-modal__skeleton-row" />
                      <div className="cart-variation-edit-modal__skeleton-chips" />
                      <div className="cart-variation-edit-modal__skeleton-row cart-variation-edit-modal__skeleton-row--short" />
                      <div className="cart-variation-edit-modal__skeleton-swatches" />
                    </div>
                  ) : product && variantSelection.hasSizes ? (
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
                        compact
                      />

                      {(variantSelection.selectedSize || variantSelection.selectedColor) ? (
                        <div className="cart-variation-edit-modal__summary">
                          {variantSelection.selectedSize ? (
                            <span className="cart-variation-edit-modal__pill">
                              Talla {variantSelection.selectedSize.label}
                            </span>
                          ) : null}
                          {variantSelection.selectedColor ? (
                            <span className="cart-variation-edit-modal__pill">
                              {variantSelection.selectedColor.label}
                            </span>
                          ) : null}
                        </div>
                      ) : null}

                      {stockHint ? (
                        <p
                          className={cn(
                            "cart-variation-edit-modal__stock-badge",
                            availableStock !== null && availableStock <= 0 && "cart-variation-edit-modal__stock-badge--out",
                          )}
                        >
                          {stockHint}
                        </p>
                      ) : null}

                      {variantSelection.validationError ? (
                        <p className="product-variant-selectors__error">
                          {variantSelection.validationError}
                        </p>
                      ) : null}
                    </>
                  ) : null}

                  {product ? (
                    <Link
                      href={productHref}
                      className="cart-variation-edit-modal__product-link"
                      onClick={handleClose}
                    >
                      {CART_COPY.viewProduct}
                    </Link>
                  ) : null}
                </div>
              </>
            )}
          </div>

          {showFooter ? (
            <div className="cart-variation-edit-modal__footer variation-qty-button">
              <div className="qty-section">
                <span className="cart-variation-edit-modal__qty-label">{CART_COPY.quantity}</span>
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
                  {updateLabel}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
