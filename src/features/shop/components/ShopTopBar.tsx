"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildFilterUrl } from "../utils/shop-url.utils";
import { SHOP_SORT_OPTIONS } from "../constants/shop.constants";

interface ShopTopBarProps {
  totalCount: number;
  start: number;
  end: number;
}

export function ShopTopBar({ totalCount, start, end }: ShopTopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "featured";

  const setParam = (key: string, value: string) =>
    router.push(buildFilterUrl(pathname, searchParams, { [key]: value }));

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f1f1] pb-4">
      <p className="text-[13px] text-[#777]">
        {totalCount === 0 ? (
          "Sin resultados"
        ) : (
          <>
            Mostrando{" "}
            <span className="font-semibold text-[#333]">
              {start}–{end}
            </span>{" "}
            de <span className="font-semibold text-[#333]">{totalCount}</span> productos
          </>
        )}
      </p>

      <select
        value={currentSort}
        onChange={(e) => setParam("sort", e.target.value)}
        className="cursor-pointer rounded border border-[#e5e5e5] bg-white py-1.5 pl-3 pr-8 text-[13px] text-[#555] focus:border-theme focus:outline-none"
        aria-label="Ordenar por"
      >
        {SHOP_SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
