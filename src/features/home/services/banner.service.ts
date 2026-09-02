import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import type { HomeBanner, PublicBannersResponse } from "@/features/home/types/banner.types";
import { apiGet } from "@/services/http-client";
import { resolveStoreMediaUrl } from "@/utils/resolve-store-media-url";

export async function getHomeBanners(): Promise<HomeBanner[]> {
  try {
    const response = await apiGet<PublicBannersResponse>("ecommerce/banners", {
      revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
    });

    return response.banners
      .filter((banner) => banner.imageUrl)
      .map((banner) => ({
        ...banner,
        imageUrl: resolveStoreMediaUrl(banner.imageUrl),
      }))
      .sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}
