import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import type {
  HomeServiceItem,
  HomeServicesConfig,
  PublicHomeServicesResponse,
} from "@/features/home/types/home-services.types";
import { apiGet } from "@/services/http-client";
import { resolveStoreMediaUrl } from "@/utils/resolve-store-media-url";

export async function getHomeServices(): Promise<HomeServiceItem[]> {
  try {
    const response = await apiGet<PublicHomeServicesResponse>("ecommerce/home/services", {
      revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
    });

    if (!response.services || response.services.status === false) {
      return [];
    }

    return filterActiveServices(response.services);
  } catch {
    return [];
  }
}

function filterActiveServices(config: HomeServicesConfig): HomeServiceItem[] {
  return (config.services ?? [])
    .filter((service) => service.status !== false && service.title)
    .map((service) => ({
      ...service,
      imageUrl: resolveStoreMediaUrl(service.imageUrl),
    }));
}
