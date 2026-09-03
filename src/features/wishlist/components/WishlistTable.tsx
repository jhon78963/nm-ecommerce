"use client";

import { useMemo } from "react";

import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { useWishlist } from "@/features/wishlist/context/WishlistProvider";
import { WishlistEmptyState } from "@/features/wishlist/components/WishlistEmptyState";
import { WishlistRow } from "@/features/wishlist/components/WishlistRow";
import { WishlistSkeleton } from "@/features/wishlist/components/WishlistSkeleton";
import { useWishlistProducts } from "@/features/wishlist/hooks/use-wishlist-products";
import type { WishlistStoredItem } from "@/features/wishlist/types/wishlist.types";

import "./wishlist.css";

function buildFallbackProduct(item: WishlistStoredItem): ProductBoxItem {
  return {
    id: item.productId,
    slug: item.slug ?? item.productId,
    name: item.name,
    imageUrl: item.imageUrl ?? "/placeholder-product.svg",
    price: item.price,
    salePrice: item.price,
    discount: 0,
    ratingCount: null,
    reviewsCount: 0,
    stockStatus: "out_of_stock",
    sizes: [],
  };
}

export function WishlistTable({ embedded = false }: { embedded?: boolean }) {
  const { items, isHydrated } = useWishlist();
  const productIds = useMemo(() => items.map((item) => item.productId), [items]);
  const { products, isLoading } = useWishlistProducts(productIds);

  const productsById = useMemo(
    () => new Map(products.map((product) => [String(product.id), product])),
    [products],
  );

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
          {items.map((item) => (
            <WishlistRow
              key={item.productId}
              storedItem={item}
              product={productsById.get(item.productId) ?? buildFallbackProduct(item)}
            />
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
