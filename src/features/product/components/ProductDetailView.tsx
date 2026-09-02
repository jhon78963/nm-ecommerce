"use client";

import { ProductQuickViewDetails } from "@/features/product/components/quick-view/ProductQuickViewDetails";
import { ProductQuickViewGallery } from "@/features/product/components/quick-view/ProductQuickViewGallery";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";

import "@/features/product/components/quick-view/product-quick-view.css";

interface ProductDetailViewProps {
  product: ProductBoxItem;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  return (
    <section className="product-detail-page">
      <div className="mx-auto w-full max-w-[1400px] px-[15px] py-8 lg:py-12">
        <div className="quick-view-modal modal-content flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="w-full lg:w-[48%]">
            <ProductQuickViewGallery product={product} />
          </div>
          <div className="w-full lg:w-[52%]">
            <ProductQuickViewDetails product={product} onClose={() => undefined} />
          </div>
        </div>
      </div>
    </section>
  );
}
