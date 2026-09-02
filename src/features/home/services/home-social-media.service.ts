import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import type {
  HomeSocialMediaBanner,
  HomeSocialMediaConfig,
  PublicHomeSocialMediaResponse,
} from "@/features/home/types/home-social-media.types";
import { apiGet } from "@/services/http-client";
import { resolveStoreMediaUrl } from "@/utils/resolve-store-media-url";

export async function getHomeSocialMedia(): Promise<HomeSocialMediaConfig | null> {
  try {
    const response = await apiGet<PublicHomeSocialMediaResponse>("ecommerce/home/social-media", {
      revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
    });

    if (!response.socialMedia || response.socialMedia.status === false) {
      return null;
    }

    return normalizeSocialMediaConfig(response.socialMedia);
  } catch {
    return null;
  }
}

function normalizeSocialMediaConfig(config: HomeSocialMediaConfig): HomeSocialMediaConfig | null {
  const banners = filterActiveBanners(config.banners);

  if (banners.length === 0) {
    return null;
  }

  return {
    ...config,
    banners,
  };
}

function filterActiveBanners(banners: HomeSocialMediaBanner[]): HomeSocialMediaBanner[] {
  return banners
    .filter((banner) => banner.status !== false && banner.imageUrl)
    .map((banner) => ({
      ...banner,
      imageUrl: resolveStoreMediaUrl(banner.imageUrl),
    }));
}
