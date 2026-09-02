import {
  buildFallbackCategoryProductSection,
  CATEGORY_PRODUCT_REVALIDATE_SECONDS,
} from "@/features/home/constants/category-product.defaults";
import type {
  HomeCategoryProductSectionView,
  PublicCategoryProductSectionResponse,
} from "@/features/home/types/category-product.types";
import { apiGet } from "@/services/http-client";

export async function getHomeCategoryProductSection(): Promise<HomeCategoryProductSectionView | null> {
  try {
    const response = await apiGet<PublicCategoryProductSectionResponse>(
      "ecommerce/home/category-products",
      { revalidate: CATEGORY_PRODUCT_REVALIDATE_SECONDS },
    );

    if (!response.section || response.section.status === false) {
      return null;
    }

    // Hasta que el backend resuelva productos/categorías, usamos el fallback enriquecido.
    return buildFallbackCategoryProductSection();
  } catch {
    return buildFallbackCategoryProductSection();
  }
}
