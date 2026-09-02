"use client";

import { useState } from "react";

import { ImageLink } from "@/features/home/components/banners/ImageLink";
import { CategoryProductTabCarousel } from "@/features/home/components/category-products/CategoryProductTabCarousel";
import type {
  CategoryProductTab,
  HomeCategoryProductBannerConfig,
} from "@/features/home/types/category-product.types";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { cn } from "@/lib/utils";

interface CategoryProductTabSectionProps {
  title: string;
  tabs: CategoryProductTab[];
  productsByCategoryId: Record<string, ProductBoxItem[]>;
  banner: HomeCategoryProductBannerConfig | null;
}

export function CategoryProductTabSection({
  title,
  tabs,
  productsByCategoryId,
  banner,
}: CategoryProductTabSectionProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "");
  const activeProducts = productsByCategoryId[activeTabId] ?? [];

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="theme-tab h-full">
      <div className="category-product-tab-header bg-title-part">
        <h5 className="category-product-tab-header__title title-border">{title}</h5>

        <ul className="category-product-tab-header__tabs tab-title">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;

            return (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={cn(
                    "category-product-tab-header__tab",
                    isActive && "is-active",
                  )}
                >
                  {tab.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="tab-content-cls">
        <CategoryProductTabCarousel products={activeProducts} />
      </div>

      {banner ? (
        <div className="category-product-banner">
          <ImageLink
            href={banner.href}
            imageUrl={banner.imageUrl}
            alt={banner.alt ?? "Banner promocional"}
            bgImage={false}
          />
        </div>
      ) : null}
    </div>
  );
}
