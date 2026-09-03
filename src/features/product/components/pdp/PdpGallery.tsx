"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { ProductDetail } from "@/features/product/types/product-detail.types";
import { PDP_COPY } from "@/features/product/constants/pdp-copy";

interface PdpGalleryProps {
  product: ProductDetail;
}

export function PdpGallery({ product }: PdpGalleryProps) {
  const images = useMemo(() => {
    const gallery = product.galleryImageUrls?.filter(Boolean) ?? [];
    return gallery.length > 0 ? gallery : [product.imageUrl];
  }, [product.galleryImageUrls, product.imageUrl]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? product.imageUrl;

  useEffect(() => {
    setActiveIndex(0);
  }, [product.id]);

  return (
    <div className="pdp-gallery">
      {/* Main image */}
      <div className="pdp-gallery__main-wrap">
        {product.discount > 0 ? (
          <ul className="pdp-gallery__badges">
            <li className="pdp-gallery__badge pdp-gallery__badge--sale">{PDP_COPY.sale}</li>
          </ul>
        ) : null}

        <div className="pdp-gallery__main-inner">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            className="pdp-gallery__main-image"
            sizes="(min-width: 992px) 42vw, 100vw"
            priority
          />
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 ? (
        <div className="pdp-gallery__thumbs" role="tablist" aria-label="Imágenes del producto">
          {images.map((imageUrl, index) => (
            <button
              key={`${product.id}-thumb-${index}`}
              type="button"
              role="tab"
              className="pdp-thumb-btn"
              aria-pressed={index === activeIndex}
              aria-label={`Ver imagen ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            >
              <Image src={imageUrl} alt="" width={80} height={80} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
