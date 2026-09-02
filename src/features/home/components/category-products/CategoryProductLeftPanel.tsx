import { ProductBoxHorizontal } from "@/features/product/components/ProductBoxHorizontal";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";

interface CategoryProductLeftPanelProps {
  title: string;
  products: ProductBoxItem[];
}

export function CategoryProductLeftPanel({ title, products }: CategoryProductLeftPanelProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="theme-card">
      <h5 className="title-border m-0 bg-theme p-2.5 text-base font-semibold text-white capitalize">
        {title}
      </h5>

      <div className="offer-slider mt-0 space-y-2">
        {products.map((product) => (
          <ProductBoxHorizontal key={product.id} product={product} className="mt-0" />
        ))}
      </div>
    </div>
  );
}
