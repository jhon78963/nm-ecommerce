"use client";

import { ProductBox } from "@/features/product/components/ProductBox";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";

interface CategoryProductTabCarouselProps {
  products: ProductBoxItem[];
}

export function CategoryProductTabCarousel({ products }: CategoryProductTabCarouselProps) {
  if (products.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[#777]">No hay productos en esta categoría.</p>
    );
  }

  return (
    <div className="category-product-carousel product-4 product-m">
      <div className="category-product-track">
        {products.map((product) => (
          <div key={product.id} className="category-product-slide">
            <ProductBox product={product} fullHeight featured />
          </div>
        ))}
      </div>
    </div>
  );
}
