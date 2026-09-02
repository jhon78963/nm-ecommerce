"use client";

import { Heart } from "lucide-react";

import type { SearchProduct } from "@/features/search/types/search.types";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { cn } from "@/lib/utils";

interface WishlistToggleButtonProps {
  product: SearchProduct;
  className?: string;
}

export function WishlistToggleButton({ product, className }: WishlistToggleButtonProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const active = isInWishlist(product.id);

  return (
    <button
      type="button"
      onClick={() => toggleItem(product)}
      className={cn(
        "inline-flex size-9 items-center justify-center border border-[#eee] bg-white text-[#777] transition-colors hover:text-theme",
        active && "border-theme text-theme",
        className,
      )}
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={active}
    >
      <Heart className={cn("size-4", active && "fill-current")} />
    </button>
  );
}
