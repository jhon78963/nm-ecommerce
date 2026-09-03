"use client";

import type { MouseEvent } from "react";
import { Search } from "lucide-react";

import { PRODUCT_COPY } from "@/features/product/constants/product-copy";
import { useQuickView } from "@/features/product/context/QuickViewProvider";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { cn } from "@/lib/utils";

interface ProductQuickViewButtonProps {
  product: ProductBoxItem;
  className?: string;
  selectedSizeId?: string | null;
  selectedColorId?: string | null;
}

export function ProductQuickViewButton({
  product,
  className,
  selectedSizeId,
  selectedColorId,
}: ProductQuickViewButtonProps) {
  const { openQuickView } = useQuickView();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    openQuickView(product, {
      sizeId: selectedSizeId,
      colorId: selectedColorId,
    });
  }

  return (
    <a href="#" title={PRODUCT_COPY.quickView} className={cn(className)} onClick={handleClick}>
      <Search />
    </a>
  );
}
