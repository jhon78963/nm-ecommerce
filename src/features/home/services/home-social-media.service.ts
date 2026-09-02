import {
  FALLBACK_HOME_SOCIAL_MEDIA,
  HOME_SOCIAL_MEDIA_REVALIDATE_SECONDS,
} from "@/features/home/constants/home-social-media.defaults";
import type {
  HomeSocialMediaBanner,
  HomeSocialMediaConfig,
  PublicHomeSocialMediaResponse,
} from "@/features/home/types/home-social-media.types";
import { apiGet } from "@/services/http-client";

export async function getHomeSocialMedia(): Promise<HomeSocialMediaConfig | null> {
  try {
    const response = await apiGet<PublicHomeSocialMediaResponse>("ecommerce/home/social-media", {
      revalidate: HOME_SOCIAL_MEDIA_REVALIDATE_SECONDS,
    });

    if (!response.socialMedia || response.socialMedia.status === false) {
      return null;
    }

    return normalizeSocialMediaConfig(response.socialMedia);
  } catch {
    return normalizeSocialMediaConfig(FALLBACK_HOME_SOCIAL_MEDIA);
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
  return banners.filter((banner) => banner.status !== false && banner.imageUrl);
}
