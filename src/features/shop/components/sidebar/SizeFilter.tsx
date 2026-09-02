"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { buildFilterUrl } from "../../utils/shop-url.utils";
import type { ShopSidebarFilter } from "../../types/shop.types";

interface SizeFilterProps {
  sizes: ShopSidebarFilter[];
}

export function SizeFilter({ sizes }: SizeFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = new Set((searchParams.get("tallas") ?? "").split(",").filter(Boolean));

  const toggle = (sizeId: string) => {
    const next = new Set(active);
    next.has(sizeId) ? next.delete(sizeId) : next.add(sizeId);
    const value = [...next].join(",");
    router.push(buildFilterUrl(pathname, searchParams, { tallas: value || undefined }));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const isActive = active.has(size.id);
        return (
          <button
            key={size.id}
            type="button"
            onClick={() => toggle(size.id)}
            className={cn(
              "min-w-[38px] rounded border px-2.5 py-1 text-[12px] font-semibold transition-all duration-200",
              isActive
                ? "border-theme bg-theme text-white"
                : "border-[#ddd] bg-white text-[#555] hover:border-theme hover:text-theme",
            )}
          >
            {size.label}
          </button>
        );
      })}
    </div>
  );
}
