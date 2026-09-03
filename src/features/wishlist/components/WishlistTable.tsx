"use client";

import { useMemo } from "react";

import type { SearchProduct } from "@/features/search/types/search.types";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { WishlistEmptyState } from "@/features/wishlist/components/WishlistEmptyState";
import { WishlistRow } from "@/features/wishlist/components/WishlistRow";
import { WishlistSkeleton } from "@/features/wishlist/components/WishlistSkeleton";
import { useWishlistProducts } from "@/features/wishlist/hooks/use-wishlist-products";

import "./wishlist.css";

function buildFallbackProducts(
  storedItems: ReturnType<typeof useWishlist>["items"],
): SearchProduct[] {
  return storedItems.map((item) => ({
    id: item.productId,
    name: item.name,
    sizes: item.price > 0 ? [{ id: item.productId, salePrice: item.price, stock: 0 }] : [],
  }));
}

export function WishlistTable({ embedded = false }: { embedded?: boolean }) {
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
    <div className={`wishlist-block${embedded ? " wishlist-block--embedded" : ""}`}>
      <div className="table-responsive">
        <table className="cart-table">
        <thead>
          <tr className="table-head">
            <th scope="col">Imagen</th>
            <th scope="col">Producto</th>
            <th scope="col">Precio</th>
            <th scope="col">Disponibilidad</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {displayProducts.map((product) => (
            <WishlistRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
