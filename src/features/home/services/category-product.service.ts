import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import type {
  HomeCategoryProductSectionConfig,
  HomeCategoryProductSectionView,
  PublicCategoryProductSectionResponse,
} from "@/features/home/types/category-product.types";
import { getProductsByIds } from "@/features/product/services/catalog.service";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { apiGet } from "@/services/http-client";
import { resolveStoreMediaUrl } from "@/utils/resolve-store-media-url";

export async function getHomeCategoryProductSection(): Promise<HomeCategoryProductSectionView | null> {
  try {
    const response = await apiGet<PublicCategoryProductSectionResponse>(
      "ecommerce/home/category-products",
      { revalidate: STORE_CONTENT_REVALIDATE_SECONDS },
    );

    if (!response.section || response.section.status === false) {
      return null;
    }

    return resolveCategoryProductSection(response.section);
  } catch {
    return null;
  }
}

async function resolveCategoryProductSection(
  config: HomeCategoryProductSectionConfig,
): Promise<HomeCategoryProductSectionView | null> {
  const leftPanel = await resolveLeftPanel(config);
  const rightPanel = await resolveRightPanel(config);

  if (!leftPanel && rightPanel.productCategory.tabs.length === 0) {
    return null;
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

  const products =
    config.leftPanel.productIds.length > 0
      ? await getProductsByIds(config.leftPanel.productIds)
      : [];

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
  const rightPanel = config.rightPanel;
  const productCategory = rightPanel?.productCategory;
  const tabsConfig = productCategory?.tabs ?? [];
  const tabs = tabsConfig.map((tab) => ({
    id: tab.id,
    name: tab.name,
    slug: tab.slug,
  }));

  const productsByCategoryId: Record<string, ProductBoxItem[]> = {};

  if (productCategory?.status !== false) {
    await Promise.all(
      tabs.map(async (tab) => {
        const tabConfig = tabsConfig.find((item) => item.id === tab.id);
        const products =
          tabConfig && tabConfig.productIds.length > 0
            ? await getProductsByIds(tabConfig.productIds)
            : [];

        if (products.length > 0) {
          productsByCategoryId[tab.id] = products;
        }
      }),
    );
  }

  const activeTabs = tabs.filter((tab) => (productsByCategoryId[tab.id]?.length ?? 0) > 0);

  const banner =
    rightPanel?.productBanner?.status !== false && rightPanel?.productBanner?.imageUrl
      ? {
          ...rightPanel.productBanner,
          imageUrl: resolveStoreMediaUrl(rightPanel.productBanner.imageUrl),
        }
      : null;

  return {
    productCategory: {
      title: productCategory?.title ?? "",
      status: productCategory?.status !== false && activeTabs.length > 0,
      tabs: activeTabs,
      productsByCategoryId,
    },
    productBanner: banner,
  };
}
