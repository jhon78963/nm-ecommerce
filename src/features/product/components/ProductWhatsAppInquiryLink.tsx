"use client";

import { useMemo } from "react";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { env } from "@/config/env";
import {
  buildWhatsAppProductInquiryUrl,
  type WhatsAppProductInquiryInput,
} from "@/features/product/utils/build-whatsapp-product-inquiry";
import { cn } from "@/lib/utils";

interface ProductWhatsAppInquiryLinkProps extends WhatsAppProductInquiryInput {
  label: string;
  className?: string;
  productPath?: string;
}

export function ProductWhatsAppInquiryLink({
  label,
  className,
  productName,
  sizeLabel,
  colorLabel,
  barcode,
  productUrl,
  productPath,
}: ProductWhatsAppInquiryLinkProps) {
  const href = useMemo(
    () =>
      buildWhatsAppProductInquiryUrl({
        productName,
        sizeLabel,
        colorLabel,
        barcode,
        productUrl: productUrl ?? (productPath ? `${env.appUrl}${productPath}` : null),
      }),
    [barcode, colorLabel, productName, productPath, productUrl, sizeLabel],
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("quick-view-action-link", className)}
    >
      <WhatsAppIcon className="size-4 text-[#25D366]" />
      <span>{label}</span>
    </a>
  );
}
