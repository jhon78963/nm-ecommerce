import { Suspense } from "react";
import { ShopSidebar } from "./sidebar/ShopSidebar";
import { ShopTopBar } from "./ShopTopBar";
import { ShopActiveFilters } from "./ShopActiveFilters";
import { ShopProductGrid } from "./ShopProductGrid";
import { ShopPagination } from "./ShopPagination";
import { ShopBanner } from "./ShopBanner";
import { ShopMobileFilterToggle } from "./ShopMobileFilterToggle";
import { getPaginationInfo } from "../utils/shop-url.utils";
import type { ShopPageProps } from "../types/shop.types";

export function ShopPage({
  collection,
  collections,
  products,
  totalCount,
  currentPage,
  facets,
}: ShopPageProps) {
  const { totalPages, start, end } = getPaginationInfo(totalCount, currentPage);

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="hidden lg:block lg:w-[272px] lg:shrink-0">
            <div className="sticky top-24">
              <ShopSidebar
                collections={collections}
                activeCollection={collection}
                facets={facets}
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <h1 className="text-[18px] font-semibold text-[#222]">{collection.label}</h1>
              <Suspense>
                <ShopMobileFilterToggle
                  collections={collections}
                  activeCollection={collection}
                  facets={facets}
                />
              </Suspense>
            </div>

            <h1 className="mb-5 hidden text-[22px] font-semibold text-[#222] lg:block">
              {collection.label}
            </h1>

            {collection.bannerImageUrl ? (
              <ShopBanner imageUrl={collection.bannerImageUrl} alt={collection.label} />
            ) : null}

            <Suspense>
              <ShopTopBar totalCount={totalCount} start={start} end={end} />
            </Suspense>

            <Suspense>
              <ShopActiveFilters facets={facets} />
            </Suspense>

            <ShopProductGrid products={products} />

            <Suspense>
              <ShopPagination currentPage={currentPage} totalPages={totalPages} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
