"use client";

import { ProductBox } from "@/features/product/components/ProductBox";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";

import "./product-collection.css";

const CAROUSEL_THRESHOLD = 4;

interface ProductCollectionLayoutProps {
  products: ProductBoxItem[];
}

export function ProductCollectionLayout({ products }: ProductCollectionLayoutProps) {
  const isCarousel = products.length > CAROUSEL_THRESHOLD;

  if (isCarousel) {
    return (
      <div className="product-collection-carousel">
        <div className="product-collection-track">
          {products.map((product) => (
            <div key={product.id} className="product-collection-slide">
              <ProductBox product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="product-collection-grid">
      {products.map((product) => (
        <ProductBox key={product.id} product={product} />
      ))}
    </div>
  );
}
