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
    <div className="theme-card h-full">
      <h5 className="category-product-panel-header">{title}</h5>

      <div className="offer-slider">
        <div>
          {products.map((product) => (
            <ProductBoxHorizontal key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
