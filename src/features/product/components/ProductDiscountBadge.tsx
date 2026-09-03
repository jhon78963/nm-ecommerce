import type { ProductDiscountBadge as ProductDiscountBadgeData } from "@/features/product/utils/product-discount-badge";
import { cn } from "@/lib/utils";

import "./product-discount-badge.css";

interface ProductDiscountBadgeProps {
  badge: ProductDiscountBadgeData;
  className?: string;
}

export function ProductDiscountBadge({ badge, className }: ProductDiscountBadgeProps) {
  const isCash = badge.kind === "cash";

  return (
    <div
      className={cn(
        "product-discount-badge",
        isCash ? "product-discount-badge--cash" : "product-discount-badge--percent",
        className,
      )}
      aria-label={isCash ? `Descuento de ${badge.label}` : `Descuento del ${badge.label}`}
    >
      {!isCash ? <span className="product-discount-badge__ribbon" aria-hidden /> : null}
      <span className="product-discount-badge__label">{badge.label}</span>
    </div>
  );
}
