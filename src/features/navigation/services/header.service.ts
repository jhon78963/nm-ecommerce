import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import { apiGet } from "@/services/http-client";

import { FALLBACK_HEADER_CONFIG } from "@/features/navigation/constants/header.defaults";
import type { PublicHeaderResponse, StoreHeaderConfig } from "@/features/navigation/types/header.types";
import { mapPublicHeaderToConfig } from "@/features/navigation/utils/map-header-config";

export const STORE_HEADER_CACHE_TAG = "store-header";

export async function getStoreHeaderConfig(): Promise<StoreHeaderConfig> {
  try {
    const response = await apiGet<PublicHeaderResponse>("ecommerce/header", {
      revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
      tags: [STORE_HEADER_CACHE_TAG],
    });

    return mapPublicHeaderToConfig(response);
  } catch {
    return FALLBACK_HEADER_CONFIG;
  }
}
