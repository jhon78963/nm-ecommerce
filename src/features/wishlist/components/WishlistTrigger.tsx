"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function WishlistTrigger() {
  const { itemCount } = useWishlist();

  return (
    <Link
      href={ROUTES.favorites}
      className="relative inline-flex items-center justify-center text-[#6a6a6a] transition-colors hover:text-theme"
      aria-label="Lista de favoritos"
    >
      <Heart className="size-[clamp(21px,1.6vw,25px)] stroke-[1.5]" />
      {itemCount > 0 ? (
        <span
          className={cn(
            "absolute -right-2 top-[20%] flex items-center justify-center",
            "rounded-full bg-theme font-semibold text-white",
            "size-[clamp(16px,1.2vw,20px)] text-[clamp(10px,0.8vw,12px)] leading-none",
          )}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}
