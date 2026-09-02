"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { buildFilterUrl, getActiveFilters } from "../utils/shop-url.utils";
import type { ShopActiveFilter, ShopProductsFacets } from "../types/shop.types";

interface ShopActiveFiltersProps {
  facets: ShopProductsFacets;
}

export function ShopActiveFilters({ facets }: ShopActiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFilters = getActiveFilters(searchParams, facets);

  if (activeFilters.length === 0) return null;

  const removeFilter = ({ key, value }: ShopActiveFilter) => {
    if (key === "price") {
      router.push(
        buildFilterUrl(pathname, searchParams, { minPrice: undefined, maxPrice: undefined }),
      );
      return;
    }
    const current = (searchParams.get(key) ?? "").split(",").filter(Boolean);
    const next = current.filter((v) => v !== value).join(",");
    router.push(buildFilterUrl(pathname, searchParams, { [key]: next || undefined }));
  };

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <span className="text-[12px] font-medium uppercase tracking-wide text-[#999]">
        Filtros activos:
      </span>

      {activeFilters.map((filter) => (
        <span
          key={`${filter.key}-${filter.value}`}
          className="flex items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white px-3 py-1 text-[12px] text-[#555]"
        >
          {filter.label}
          <button
            type="button"
            aria-label={`Eliminar filtro ${filter.label}`}
            onClick={() => removeFilter(filter)}
            className="text-[#bbb] transition-colors hover:text-theme"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={() => router.push(pathname)}
        className="text-[12px] text-theme underline underline-offset-2 hover:no-underline"
      >
        Limpiar todo
      </button>
    </div>
  );
}
