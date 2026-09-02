import type { ProductBoxItem } from "@/features/product/types/product-box.types";

export interface CategoryProductTab {
  id: string;
  name: string;
  slug?: string;
}

export interface HomeCategoryProductLeftPanel {
  title: string;
  status?: boolean;
  productIds: Array<string | number>;
}

export interface HomeCategoryProductTabConfig {
  title: string;
  status?: boolean;
  categoryIds: Array<string | number>;
}

export interface HomeCategoryProductBannerConfig {
  status?: boolean;
  imageUrl: string;
  href: string;
  alt?: string;
}

export interface HomeCategoryProductSectionConfig {
  status?: boolean;
  leftPanel?: HomeCategoryProductLeftPanel;
  rightPanel: {
    productCategory: HomeCategoryProductTabConfig;
    productBanner?: HomeCategoryProductBannerConfig;
  };
}

/** Respuesta esperada de GET /api/v1/ecommerce/home/category-products */
export interface PublicCategoryProductSectionResponse {
  section: HomeCategoryProductSectionConfig | null;
}

export interface HomeCategoryProductLeftPanelView {
  title: string;
  status: boolean;
  products: ProductBoxItem[];
}

export interface HomeCategoryProductRightPanelView {
  productCategory: {
    title: string;
    status: boolean;
    tabs: CategoryProductTab[];
    productsByCategoryId: Record<string, ProductBoxItem[]>;
  };
  productBanner: HomeCategoryProductBannerConfig | null;
}

export interface HomeCategoryProductSectionView {
  status: boolean;
  leftPanel: HomeCategoryProductLeftPanelView | null;
  rightPanel: HomeCategoryProductRightPanelView;
}
