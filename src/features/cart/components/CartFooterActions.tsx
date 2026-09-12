"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, ShoppingCart } from "lucide-react";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { CART_COPY } from "@/features/cart/constants/cart-copy";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

import "./cart-footer-actions.css";

interface CartFooterActionsProps {
  whatsappHref: string;
  variant: "offcanvas" | "page";
  onNavigate?: () => void;
  className?: string;
}

export function CartFooterActions({
  whatsappHref,
  variant,
  onNavigate,
  className,
}: CartFooterActionsProps) {
  const handleNavigate = () => {
    onNavigate?.();
  };

  const isOffcanvas = variant === "offcanvas";

  const whatsappLabel = isOffcanvas ? CART_COPY.whatsappShort : CART_COPY.whatsappPage;
  const middleLabel = isOffcanvas ? CART_COPY.viewCartShort : CART_COPY.continueShopping;
  const checkoutLabel = isOffcanvas ? CART_COPY.checkoutShort : CART_COPY.checkout;

  const middleHref = isOffcanvas ? ROUTES.cart : "/";
  const MiddleIcon = isOffcanvas ? ShoppingCart : ShoppingBag;

  return (
    <div
      className={cn(
        "cart-footer-actions",
        isOffcanvas ? "cart-footer-actions--offcanvas" : "cart-footer-actions--page",
        className,
      )}
    >
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="cart-footer-actions__btn cart-footer-actions__btn--whatsapp"
        aria-label={CART_COPY.whatsappCart}
      >
        <WhatsAppIcon className="size-4" aria-hidden="true" />
        <span>{whatsappLabel}</span>
      </a>

      <Link
        href={middleHref}
        onClick={handleNavigate}
        className="cart-footer-actions__btn cart-footer-actions__btn--theme-outline"
        aria-label={isOffcanvas ? CART_COPY.viewCart : CART_COPY.continueShopping}
      >
        <MiddleIcon className="size-4" aria-hidden="true" />
        <span>{middleLabel}</span>
      </Link>

      <Link
        href={ROUTES.checkout}
        onClick={handleNavigate}
        className="cart-footer-actions__btn cart-footer-actions__btn--theme-cta"
        aria-label={CART_COPY.checkout}
      >
        <ArrowRight className="size-4" aria-hidden="true" />
        <span>{checkoutLabel}</span>
      </Link>
    </div>
  );
}
