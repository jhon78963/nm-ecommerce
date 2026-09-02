"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildFilterUrl } from "../../utils/shop-url.utils";
import type { ShopSidebarFilter } from "../../types/shop.types";

interface ColorFilterProps {
  colors: ShopSidebarFilter[];
}

export function ColorFilter({ colors }: ColorFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = new Set((searchParams.get("colores") ?? "").split(",").filter(Boolean));

  const toggle = (colorId: string) => {
    const next = new Set(active);
    next.has(colorId) ? next.delete(colorId) : next.add(colorId);
    const value = [...next].join(",");
    router.push(buildFilterUrl(pathname, searchParams, { colores: value || undefined }));
  };

  const isLight = (hex?: string) =>
    hex === "#f0f0f0" || hex === "#fdd835" || hex === "#d7ccc8";

  return (
    <div className="flex flex-wrap gap-2.5">
      {colors.map((color) => {
        const isActive = active.has(color.id);
        return (
          <button
            key={color.id}
            type="button"
            title={color.label}
            onClick={() => toggle(color.id)}
            style={{ backgroundColor: color.hex }}
            className={cn(
              "relative h-7 w-7 rounded-full border-2 transition-all duration-200 hover:scale-110",
              isActive ? "scale-110 border-theme shadow-md" : "border-transparent",
              isLight(color.hex) && "ring-1 ring-[#ddd]",
            )}
          >
            {isActive && (
              <Check
                className={cn(
                  "absolute inset-0 m-auto h-3.5 w-3.5",
                  isLight(color.hex) ? "text-[#333]" : "text-white",
                )}
              />
            )}
            <span className="sr-only">{color.label}</span>
          </button>
        );
      })}
    </div>
  );
}
