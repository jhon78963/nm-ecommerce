"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildFilterUrl } from "../../utils/shop-url.utils";

const PRESETS = [
  { label: "Hasta S/ 50", min: "0", max: "50" },
  { label: "S/ 50 – S/ 100", min: "50", max: "100" },
  { label: "S/ 100 – S/ 200", min: "100", max: "200" },
  { label: "Más de S/ 200", min: "200", max: undefined },
];

export function PriceRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [min, setMin] = useState(searchParams.get("minPrice") ?? "");
  const [max, setMax] = useState(searchParams.get("maxPrice") ?? "");

  const apply = (minVal: string, maxVal: string | undefined) => {
    router.push(buildFilterUrl(pathname, searchParams, { minPrice: minVal, maxPrice: maxVal }));
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => apply(preset.min, preset.max)}
            className="block w-full text-left text-[13px] text-[#555] transition-colors hover:text-theme"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="number"
          placeholder="Mín."
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="w-full rounded border border-[#e5e5e5] px-2 py-1.5 text-[13px] focus:border-theme focus:outline-none"
          min={0}
        />
        <span className="text-[#ccc]">–</span>
        <input
          type="number"
          placeholder="Máx."
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="w-full rounded border border-[#e5e5e5] px-2 py-1.5 text-[13px] focus:border-theme focus:outline-none"
          min={0}
        />
      </div>

      <button
        type="button"
        onClick={() => apply(min || "0", max || undefined)}
        className="mt-1 w-full rounded bg-theme py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
      >
        Aplicar
      </button>
    </div>
  );
}
