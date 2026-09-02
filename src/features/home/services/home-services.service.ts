import {
  FALLBACK_HOME_SERVICES,
  HOME_SERVICES_REVALIDATE_SECONDS,
} from "@/features/home/constants/home-services.defaults";
import type {
  HomeServiceItem,
  HomeServicesConfig,
  PublicHomeServicesResponse,
} from "@/features/home/types/home-services.types";
import { apiGet } from "@/services/http-client";

export async function getHomeServices(): Promise<HomeServiceItem[]> {
  try {
    const response = await apiGet<PublicHomeServicesResponse>("ecommerce/home/services", {
      revalidate: HOME_SERVICES_REVALIDATE_SECONDS,
    });

    if (!response.services || response.services.status === false) {
      return [];
    }

    return filterActiveServices(response.services);
  } catch {
    return filterActiveServices(FALLBACK_HOME_SERVICES);
  }
}

function filterActiveServices(config: HomeServicesConfig): HomeServiceItem[] {
  return config.services.filter((service) => service.status !== false && service.title);
}
