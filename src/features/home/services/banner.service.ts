import {
  BANNERS_REVALIDATE_SECONDS,
  FALLBACK_HOME_BANNERS,
} from "@/features/home/constants/banner.defaults";
import type { HomeBanner, PublicBannersResponse } from "@/features/home/types/banner.types";
import { apiGet } from "@/services/http-client";

export async function getHomeBanners(): Promise<HomeBanner[]> {
  try {
    const response = await apiGet<PublicBannersResponse>("ecommerce/banners", {
      revalidate: BANNERS_REVALIDATE_SECONDS,
    });

    return response.banners
      .filter((banner) => banner.imageUrl)
      .sort((a, b) => a.order - b.order);
  } catch {
    return FALLBACK_HOME_BANNERS;
  }
}
