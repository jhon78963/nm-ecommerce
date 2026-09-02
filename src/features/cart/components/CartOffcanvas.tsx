"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Pencil, Plus, ShoppingCart, Trash2, Truck, X } from "lucide-react";

import { useCart } from "@/features/cart/context/CartProvider";
import { formatPrice } from "@/features/cart/utils/format-price";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function CartOffcanvas() {
  const {
    items,
    isOpen,
    itemCount,
    subtotal,
    freeShippingThreshold,
    closeCart,
    clearCart,
    removeItem,
    updateQuantity,
  } = useCart();

  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const amountToFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const progressTone =
    shippingProgress <= 30 ? "bg-red-500" : shippingProgress <= 80 ? "bg-amber-400" : "bg-theme";

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className={cn(
          "overlay fixed inset-0 z-[60] bg-[#212331] transition-all duration-500",
          isOpen ? "visible opacity-80" : "invisible opacity-0",
        )}
      />

      <aside
        id="cart_side"
        className={cn(
          "add_to_cart right right-cart-box fixed top-0 z-[61] h-screen w-full max-w-[470px] bg-white",
          "transition-[right] duration-500 ease-in-out",
          isOpen ? "right-0 open-side" : "-right-[500px]",
        )}
        aria-hidden={!isOpen}
      >
        <div className="cart-inner relative flex h-full flex-col bg-white">
        <div className="cart_top mb-4 flex items-center border-b border-[#eee] px-5 py-4">
          <h3 className="mb-0 text-lg font-bold text-[#222]">
            Mi carrito <span className="font-normal text-[#777]">({itemCount})</span>
          </h3>
          <button
            type="button"
            onClick={closeCart}
            className="close-cart ml-auto flex size-[30px] items-center justify-center border border-[#eee] bg-[#f8f8f8] cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="size-5 text-[#333]" />
          </button>
        </div>

        {itemCount > 0 ? (
          <>
            <div className="success-box border-b border-[#eee] px-5 pb-2">
              {amountToFreeShipping > 0 ? (
                <p className="text-base capitalize leading-tight text-[#6a6a6a]">
                  Gasta{" "}
                  <span className="font-semibold text-theme">
                    {formatPrice(amountToFreeShipping)}
                  </span>{" "}
                  más y disfruta de{" "}
                  <span className="font-semibold text-theme">envío gratis</span>.
                </p>
              ) : (
                <p className="text-base capitalize leading-tight text-[#6a6a6a]">
                  <span className="font-semibold text-theme">¡Felicidades!</span> Disfruta de envío
                  gratis.
                </p>
              )}

              <div className="relative my-2 h-2 bg-[#e6e7e9]">
                <div
                  className={cn("relative h-full transition-all duration-300", progressTone)}
                  style={{ width: `${shippingProgress}%` }}
                >
                  <span className="absolute -right-4 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-theme text-white">
                    <Truck className="size-3.5" />
                  </span>
                </div>
              </div>
            </div>

            <div className="sidebar-title px-5 pb-3 text-right">
              <button
                type="button"
                onClick={clearCart}
                className="cursor-pointer text-[17px] font-semibold text-theme"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        ) : null}

        <div
          className={cn(
            "cart_media flex-1 overflow-y-auto px-5",
            itemCount === 0 && "empty-cart flex items-center justify-center",
          )}
        >
          <ul className="cart_product w-full">
            {itemCount === 0 ? (
              <li>
                <div className="empty-cart-box text-center">
                  <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[#f8f8f8] text-theme">
                    <ShoppingCart className="size-5" />
                  </span>
                  <h5 className="text-sm font-medium text-[#6a6a6a]">
                    No hay productos en tu carrito
                  </h5>
                </div>
              </li>
            ) : (
              items.map((item) => (
                <li key={item.id} className="border-t border-[#eee] py-3.5 first:border-t-0 first:pt-0">
                  <div className="media flex gap-4">
                    <div className="relative size-[90px] shrink-0 overflow-hidden border border-[#eee] bg-[#f8f8f8]">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          sizes="90px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#ccc]">
                          <ShoppingCart className="size-6" />
                        </div>
                      )}
                    </div>

                    <div className="media-body relative min-w-0 flex-1">
                      <h4 className="truncate text-base font-semibold text-[#333]">{item.name}</h4>
                      <p className="quantity mt-1 text-base font-normal text-[#777]">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                      {item.variation ? (
                        <p className="gram mt-1.5 text-sm text-theme">{item.variation}</p>
                      ) : null}

                      <div className="qty-box mt-3">
                        <div className="inline-flex items-center border border-[#eee]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex size-9 items-center justify-center text-[#6a6a6a] hover:text-theme"
                            aria-label={item.quantity > 1 ? "Disminuir cantidad" : "Eliminar producto"}
                          >
                            {item.quantity > 1 ? (
                              <Minus className="size-4" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </button>
                          <span className="min-w-10 border-x border-[#eee] px-2 py-2 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex size-9 items-center justify-center text-[#6a6a6a] hover:text-theme"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                      </div>

                      <div className="close-circle absolute right-0 top-0 flex gap-1">
                        {item.variationId ? (
                          <button
                            type="button"
                            className="flex size-7 items-center justify-center border border-[#eee] bg-[#f8f8f8] text-[#222]"
                            aria-label="Editar variación"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex size-7 items-center justify-center border border-[#eee] bg-[#f8f8f8] text-[#222] hover:text-red-500"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>

          {itemCount > 0 ? (
            <ul className="cart_total mt-4 border-t border-[#eee] pt-4">
              <li>
                <div className="total py-2.5">
                  <h5 className="mb-0 flex items-center justify-between text-xl font-medium capitalize text-[#333]">
                    Subtotal:
                    <span className="font-semibold text-theme">{formatPrice(subtotal)}</span>
                  </h5>
                </div>
              </li>
              <li>
                <div className="buttons flex gap-3.5">
                  <Link
                    href={ROUTES.cart}
                    onClick={closeCart}
                    className="view-cart w-full border border-theme bg-theme px-4 py-3 text-center text-sm font-semibold capitalize text-white transition-colors hover:bg-white hover:text-theme"
                  >
                    Ver carrito
                  </Link>
                  <Link
                    href={ROUTES.checkout}
                    onClick={closeCart}
                    className="checkout w-full border border-theme bg-theme px-4 py-3 text-center text-sm font-semibold capitalize text-white transition-colors hover:bg-white hover:text-theme"
                  >
                    Checkout
                  </Link>
                </div>
              </li>
            </ul>
          ) : null}
        </div>
        </div>
      </aside>
    </>
  );
}
