"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ProductBox } from "@/features/product/components/ProductBox";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { cn } from "@/lib/utils";

import "./product-collection.css";

const CAROUSEL_THRESHOLD = 3;

interface ProductCollectionLayoutProps {
  products: ProductBoxItem[];
}

export function ProductCollectionLayout({ products }: ProductCollectionLayoutProps) {
  const isCarousel = products.length > CAROUSEL_THRESHOLD;

  if (!isCarousel) {
    return (
      <div className="product-collection-grid">
        {products.map((product) => (
          <ProductBox key={product.id} product={product} fullHeight />
        ))}
      </div>
    );
  }

  return <ProductCollectionCarousel products={products} />;
}

function ProductCollectionCarousel({ products }: { products: ProductBoxItem[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    setCanScrollPrev(carousel.scrollLeft > 1);
    setCanScrollNext(carousel.scrollLeft < maxScrollLeft - 1);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    updateScrollState();

    carousel.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(carousel);

    return () => {
      carousel.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [products, updateScrollState]);

  const scrollByPage = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    const slide = carousel?.querySelector<HTMLElement>(".product-collection-slide");

    if (!carousel || !slide) {
      return;
    }

    const track = carousel.querySelector<HTMLElement>(".product-collection-track");
    const gap = track ? Number.parseFloat(getComputedStyle(track).columnGap || "0") : 0;

    carousel.scrollBy({
      left: direction * (slide.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <div className="product-collection-carousel-wrapper">
      <button
        type="button"
        className={cn(
          "product-collection-nav product-collection-nav--prev",
          !canScrollPrev && "product-collection-nav--disabled",
        )}
        onClick={() => scrollByPage(-1)}
        disabled={!canScrollPrev}
        aria-label="Productos anteriores"
      >
        <ChevronLeft className="size-5" strokeWidth={2.25} />
      </button>

      <div ref={carouselRef} className="product-collection-carousel">
        <div className="product-collection-track">
          {products.map((product) => (
            <div key={product.id} className="product-collection-slide">
              <ProductBox product={product} fullHeight />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={cn(
          "product-collection-nav product-collection-nav--next",
          !canScrollNext && "product-collection-nav--disabled",
        )}
        onClick={() => scrollByPage(1)}
        disabled={!canScrollNext}
        aria-label="Productos siguientes"
      >
        <ChevronRight className="size-5" strokeWidth={2.25} />
      </button>
    </div>
  );
}
