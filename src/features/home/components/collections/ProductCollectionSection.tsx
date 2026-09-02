import {
  DEFAULT_TODAYS_DEAL_COLLECTION,
  FALLBACK_TODAYS_DEAL_PRODUCTS,
} from "@/features/home/constants/collections/todays-deal.defaults";
import { CollectionSectionTitle } from "@/features/home/components/collections/CollectionSectionTitle";
import { ProductCollectionLayout } from "@/features/home/components/collections/ProductCollectionLayout";
import type { ProductCollectionConfig } from "@/features/home/types/collection.types";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";

interface ProductCollectionSectionProps {
  config?: ProductCollectionConfig;
  products?: ProductBoxItem[];
}

export function ProductCollectionSection({
  config = DEFAULT_TODAYS_DEAL_COLLECTION,
  products = FALLBACK_TODAYS_DEAL_PRODUCTS,
}: ProductCollectionSectionProps) {
  if (config.status === false || products.length === 0) {
    return null;
  }

  return (
    <>
      <CollectionSectionTitle config={config} />

      <section className="pt-0 pb-[70px]">
        <div className="mx-auto w-full max-w-[1400px] px-[15px]">
          <ProductCollectionLayout products={products} />
        </div>
      </section>
    </>
  );
}
