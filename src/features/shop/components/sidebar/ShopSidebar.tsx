import { Suspense } from "react";
import { FilterSection } from "./FilterSection";
import { CollectionFilter } from "./CollectionFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { SizeFilter } from "./SizeFilter";
import { ColorFilter } from "./ColorFilter";
import type { ShopCollection, ShopProductsFacets } from "../../types/shop.types";

interface ShopSidebarProps {
  collections: ShopCollection[];
  activeCollection?: ShopCollection;
  facets: ShopProductsFacets;
}

const FilterSkeleton = ({ className = "h-24" }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-[#f5f5f5] ${className}`} />
);

export function ShopSidebar({ collections, activeCollection, facets }: ShopSidebarProps) {
  return (
    <aside className="w-full">
      <div className="rounded-sm border border-[#f1f1f1] bg-white px-5 py-1">
        <FilterSection title="Colecciones">
          <CollectionFilter collections={collections} activeSlug={activeCollection?.slug} />
        </FilterSection>

        <FilterSection title="Precio">
          <Suspense fallback={<FilterSkeleton className="h-28" />}>
            <PriceRangeFilter />
          </Suspense>
        </FilterSection>

        {facets.sizes.length > 0 ? (
          <FilterSection title="Talla">
            <Suspense fallback={<FilterSkeleton className="h-10" />}>
              <SizeFilter sizes={facets.sizes} />
            </Suspense>
          </FilterSection>
        ) : null}

        {facets.colors.length > 0 ? (
          <FilterSection title="Color">
            <Suspense fallback={<FilterSkeleton className="h-10" />}>
              <ColorFilter colors={facets.colors} />
            </Suspense>
          </FilterSection>
        ) : null}
      </div>
    </aside>
  );
}
