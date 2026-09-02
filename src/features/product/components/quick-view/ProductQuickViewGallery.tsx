"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { QUICK_VIEW_COPY } from "@/features/product/constants/quick-view-copy";
import { cn } from "@/lib/utils";

interface ProductQuickViewGalleryProps {
  product: ProductBoxItem;
}

export function ProductQuickViewGallery({ product }: ProductQuickViewGalleryProps) {
  const images = useMemo(() => {
    const gallery = product.galleryImageUrls?.filter(Boolean) ?? [];

    if (gallery.length > 0) {
      return gallery;
    }

    return [product.imageUrl];
  }, [product.galleryImageUrls, product.imageUrl]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? product.imageUrl;

  useEffect(() => {
    setActiveIndex(0);
  }, [product.id]);

  return (
    <div className="quick-view-gallery">
      <div className="product-slick quick-view-gallery__main">
        {product.discount > 0 ? (
          <ul className="product-detail-label">
            <li className="soldout">{QUICK_VIEW_COPY.sale}</li>
          </ul>
        ) : null}

        <div className="slider-main-img">
          <Image
            src={activeImage}
            alt={product.name}
            width={600}
            height={600}
            className="quick-view-gallery__image"
            priority
          />
        </div>
      </div>

      {images.length > 1 ? (
        <div className="slider-nav">
          <div className="quick-view-gallery__thumbs">
            {images.map((imageUrl, index) => (
              <button
                key={`${product.id}-${index}`}
                type="button"
                className={cn("slider-image", index === activeIndex && "active")}
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <Image
                  src={imageUrl}
                  alt=""
                  width={125}
                  height={125}
                  className="quick-view-gallery__thumb-image"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
