import {
  buildFallbackCategoryProductSection,
  CATEGORY_PRODUCT_REVALIDATE_SECONDS,
  FALLBACK_CATEGORY_TABS,
  FALLBACK_LEFT_PANEL_PRODUCTS,
  FALLBACK_TAB_PRODUCTS,
} from "@/features/home/constants/category-product.defaults";
import type {
  HomeCategoryProductSectionConfig,
  HomeCategoryProductSectionView,
  PublicCategoryProductSectionResponse,
} from "@/features/home/types/category-product.types";
import { getProductsByIds } from "@/features/product/services/catalog.service";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
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

    return resolveCategoryProductSection(response.section);
  } catch {
    return buildFallbackCategoryProductSection();
  }
}

async function resolveCategoryProductSection(
  config: HomeCategoryProductSectionConfig,
): Promise<HomeCategoryProductSectionView | null> {
  const leftPanel = await resolveLeftPanel(config);
  const rightPanel = await resolveRightPanel(config);

  if (!leftPanel && rightPanel.productCategory.tabs.length === 0) {
    return buildFallbackCategoryProductSection();
  }

  return {
    status: true,
    leftPanel,
    rightPanel,
  };
}

async function resolveLeftPanel(
  config: HomeCategoryProductSectionConfig,
): Promise<HomeCategoryProductSectionView["leftPanel"]> {
  if (!config.leftPanel || config.leftPanel.status === false) {
    return null;
  }

  let products =
    config.leftPanel.productIds.length > 0
      ? await getProductsByIds(config.leftPanel.productIds)
      : [];

  if (products.length === 0) {
    products = FALLBACK_LEFT_PANEL_PRODUCTS;
  }

  if (products.length === 0) {
    return null;
  }

  return {
    title: config.leftPanel.title,
    status: true,
    products,
  };
}

async function resolveRightPanel(
  config: HomeCategoryProductSectionConfig,
): Promise<HomeCategoryProductSectionView["rightPanel"]> {
  const productCategory = config.rightPanel.productCategory;
  const tabsConfig = productCategory.tabs ?? [];
  const tabs =
    tabsConfig.length > 0
      ? tabsConfig.map((tab) => ({
          id: tab.id,
          name: tab.name,
          slug: tab.slug,
        }))
      : FALLBACK_CATEGORY_TABS;

  const productsByCategoryId: Record<string, ProductBoxItem[]> = {};

  if (productCategory.status !== false) {
    await Promise.all(
      tabs.map(async (tab) => {
        const tabConfig = tabsConfig.find((item) => item.id === tab.id);
        let products =
          tabConfig && tabConfig.productIds.length > 0
            ? await getProductsByIds(tabConfig.productIds)
            : [];

        if (products.length === 0) {
          products = FALLBACK_TAB_PRODUCTS[tab.id] ?? [];
        }

        if (products.length > 0) {
          productsByCategoryId[tab.id] = products;
        }
      }),
    );
  }

  const activeTabs = tabs.filter((tab) => (productsByCategoryId[tab.id]?.length ?? 0) > 0);

  const banner =
    config.rightPanel.productBanner?.status !== false && config.rightPanel.productBanner?.imageUrl
      ? config.rightPanel.productBanner
      : null;

  return {
    productCategory: {
      title: productCategory.title,
      status: productCategory.status !== false && activeTabs.length > 0,
      tabs: activeTabs,
      productsByCategoryId,
    },
    productBanner: banner,
  };
}
