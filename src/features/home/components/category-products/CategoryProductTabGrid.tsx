import { ProductBox } from "@/features/product/components/ProductBox";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";

interface CategoryProductTabGridProps {
  products: ProductBoxItem[];
}

export function CategoryProductTabGrid({ products }: CategoryProductTabGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[#777]">No hay productos en esta categoría.</p>
    );
  }

  return (
    <div className="category-product-grid">
      {products.map((product) => (
        <div key={product.id} className="category-product-grid__item">
          <ProductBox product={product} fullHeight />
        </div>
      ))}
    </div>
  );
}
