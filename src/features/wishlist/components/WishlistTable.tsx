"use client";

import { useMemo } from "react";

import type { SearchProduct } from "@/features/search/types/search.types";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { WishlistEmptyState } from "@/features/wishlist/components/WishlistEmptyState";
import { WishlistRow } from "@/features/wishlist/components/WishlistRow";
import { WishlistSkeleton } from "@/features/wishlist/components/WishlistSkeleton";
import { useWishlistProducts } from "@/features/wishlist/hooks/use-wishlist-products";

function buildFallbackProducts(
  storedItems: ReturnType<typeof useWishlist>["items"],
): SearchProduct[] {
  return storedItems.map((item) => ({
    id: item.productId,
    name: item.name,
    sizes: item.price > 0 ? [{ id: item.productId, salePrice: item.price, stock: 0 }] : [],
  }));
}

export function WishlistTable() {
  const { items, isHydrated } = useWishlist();
  const productIds = useMemo(() => items.map((item) => item.productId), [items]);
  const { products, isLoading } = useWishlistProducts(productIds);

  const displayProducts = products.length > 0 ? products : buildFallbackProducts(items);
  const showSkeleton = !isHydrated || (items.length > 0 && isLoading && products.length === 0);

  if (showSkeleton) {
    return <WishlistSkeleton />;
  }

  if (items.length === 0) {
    return <WishlistEmptyState />;
  }

  return (
    <div className="table-responsive overflow-x-auto">
      <table className="cart-table w-full min-w-[720px] border border-[#eee]">
        <thead>
          <tr className="table-head">
            <th scope="col" className="bg-[#f8f8f8] px-3 py-4 text-center text-[17px] font-semibold text-[#222]">
              Imagen
            </th>
            <th scope="col" className="bg-[#f8f8f8] px-3 py-4 text-center text-[17px] font-semibold text-[#222]">
              Producto
            </th>
            <th
              scope="col"
              className="hidden bg-[#f8f8f8] px-3 py-4 text-center text-[17px] font-semibold text-[#222] md:table-cell"
            >
              Precio
            </th>
            <th
              scope="col"
              className="hidden bg-[#f8f8f8] px-3 py-4 text-center text-[17px] font-semibold text-[#222] md:table-cell"
            >
              Disponibilidad
            </th>
            <th
              scope="col"
              className="hidden bg-[#f8f8f8] px-3 py-4 text-center text-[17px] font-semibold text-[#222] md:table-cell"
            >
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {displayProducts.map((product) => (
            <WishlistRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
