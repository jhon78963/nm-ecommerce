import { CategoryProductLeftPanel } from "@/features/home/components/category-products/CategoryProductLeftPanel";
import { CategoryProductTabSection } from "@/features/home/components/category-products/CategoryProductTabSection";
import type { HomeCategoryProductSectionView } from "@/features/home/types/category-product.types";
import { cn } from "@/lib/utils";

import "./category-product-section.css";

interface HomeCategoryProductSectionProps {
  section: HomeCategoryProductSectionView | null;
}

export function HomeCategoryProductSection({ section }: HomeCategoryProductSectionProps) {
  if (!section || section.status === false) {
    return null;
  }

  const hasLeftPanel = section.leftPanel?.status !== false && (section.leftPanel?.products.length ?? 0) > 0;
  const hasRightPanel =
    section.rightPanel.productCategory.status !== false
    && section.rightPanel.productCategory.tabs.length > 0;

  if (!hasLeftPanel && !hasRightPanel) {
    return null;
  }

  return (
    <section className="category-product-section tools_product bg-title pb-[70px] pt-[70px]">
      <div className="mx-auto w-full max-w-[1400px] px-[15px]">
        <div className={cn("category-product-row", hasLeftPanel && "has-left-panel")}>
          {hasLeftPanel ? (
            <div className="min-w-0">
              <CategoryProductLeftPanel
                title={section.leftPanel!.title}
                products={section.leftPanel!.products}
              />
            </div>
          ) : null}

          {hasRightPanel ? (
            <div className="min-w-0">
              <CategoryProductTabSection
                title={section.rightPanel.productCategory.title}
                tabs={section.rightPanel.productCategory.tabs}
                productsByCategoryId={section.rightPanel.productCategory.productsByCategoryId}
                banner={section.rightPanel.productBanner}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
