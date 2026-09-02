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
    <div className="theme-tab">
      <div className="mb-[30px] -mt-1.5 flex flex-col gap-3 bg-theme p-2.5 sm:flex-row sm:items-center sm:gap-4">
        <h5 className="m-0 text-base font-semibold text-white capitalize sm:text-lg">{title}</h5>

        <ul className="m-0 flex list-none flex-wrap gap-0 p-0 sm:ml-auto sm:justify-end">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;

            return (
              <li key={tab.id} className="px-0 first:pl-0 last:pr-0">
                <button
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={cn(
                    "cursor-pointer border-none bg-transparent px-4 py-1 text-sm uppercase transition-colors",
                    isActive ? "font-semibold text-white" : "text-white/70 hover:text-white",
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
        <div className="banner-tools mx-2.5 mt-4 sm:mx-2.5">
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
