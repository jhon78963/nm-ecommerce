"use client";

import { useMemo } from "react";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import {
  buildWhatsAppProductPurchaseUrl,
  type WhatsAppProductPurchaseInput,
} from "@/features/product/utils/build-whatsapp-product-purchase";
import { mergeWhatsAppPendingLine } from "@/features/cart/whatsapp-pending/whatsapp-pending-cart.storage";
import type { WhatsAppPendingCartLine } from "@/features/cart/whatsapp-pending/types";
import { buildAbsolutePublicUrl } from "@/lib/public-site-url";
import { cn } from "@/lib/utils";

interface ProductWhatsAppPurchaseButtonProps extends WhatsAppProductPurchaseInput {
  label: string;
  className?: string;
  productPath?: string;
  variant?: "button" | "link";
}

export function ProductWhatsAppPurchaseButton({
  label,
  className,
  productId,
  productName,
  quantity,
  unitPriceLabel,
  sizeLabel,
  colorLabel,
  sku,
  productUrl,
  productPath,
  variant = "link",
}: ProductWhatsAppPurchaseButtonProps) {
  const href = useMemo(
    () =>
      buildWhatsAppProductPurchaseUrl({
        productId,
        productName,
        quantity,
        unitPriceLabel,
        sizeLabel,
        colorLabel,
        sku,
        productUrl: productUrl ?? (productPath ? buildAbsolutePublicUrl(productPath) : null),
      }),
    [
      colorLabel,
      productId,
      productName,
      productPath,
      productUrl,
      quantity,
      sizeLabel,
      sku,
      unitPriceLabel,
    ],
  );

  const queuePendingLine = () => {
    const line: WhatsAppPendingCartLine = {
      productId,
      productName,
      quantity,
      unitPriceLabel,
      sizeLabel,
      colorLabel,
      sku,
      productUrl: productUrl ?? (productPath ? buildAbsolutePublicUrl(productPath) : null),
    };
    mergeWhatsAppPendingLine(line);
  };

  if (variant === "button") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={queuePendingLine}
        className={cn("btn btn-outline w-full inline-flex items-center justify-center gap-2", className)}
      >
        <WhatsAppIcon className="size-4 text-[#25D366]" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={queuePendingLine}
      className={cn("quick-view-action-link", className)}
    >
      <WhatsAppIcon className="size-4 text-[#25D366]" />
      <span>{label}</span>
    </a>
  );
}
