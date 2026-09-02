import { ShoppingBag } from "lucide-react";
import { ProductBox } from "@/features/product/components/ProductBox";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";

interface ShopProductGridProps {
  products: ProductBoxItem[];
}

function EmptyState() {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf3ec]">
        <ShoppingBag className="h-8 w-8 text-theme" />
      </div>
      <div>
        <h3 className="mb-1 text-[16px] font-semibold text-[#333]">Sin productos</h3>
        <p className="max-w-xs text-[13px] leading-relaxed text-[#777]">
          No encontramos productos con los filtros seleccionados. Prueba con otros criterios.
        </p>
      </div>
    </div>
  );
}

export function ShopProductGrid({ products }: ShopProductGridProps) {
  if (products.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
      {products.map((product) => (
        <ProductBox key={product.id} product={product} fullHeight />
      ))}
    </div>
  );
}
