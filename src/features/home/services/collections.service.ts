import {
  DEFAULT_TODAYS_DEAL_COLLECTION,
  FALLBACK_TODAYS_DEAL_PRODUCTS,
} from "@/features/home/constants/collections/todays-deal.defaults";
import type {
  HomeCollectionItem,
  HomeCollectionView,
  PublicCollectionsResponse,
} from "@/features/home/types/collection.types";
import { getProductsByIds } from "@/features/product/services/catalog.service";
import { apiGet } from "@/services/http-client";

export const COLLECTIONS_REVALIDATE_SECONDS = 300;

const FALLBACK_COLLECTIONS_BY_ID: Record<string, typeof FALLBACK_TODAYS_DEAL_PRODUCTS> = {
  "todays-deal": FALLBACK_TODAYS_DEAL_PRODUCTS,
};

export async function getHomeCollections(): Promise<HomeCollectionView[]> {
  try {
    const response = await apiGet<PublicCollectionsResponse>("ecommerce/home/collections", {
      revalidate: COLLECTIONS_REVALIDATE_SECONDS,
    });

    if (!response.collections?.length) {
      return buildFallbackCollections();
    }

    const collections = await Promise.all(
      response.collections.map((collection) => resolveCollection(collection)),
    );

    const activeCollections = collections.filter(
      (collection): collection is HomeCollectionView => collection !== null,
    );

    return activeCollections.length > 0 ? activeCollections : buildFallbackCollections();
  } catch {
    return buildFallbackCollections();
  }
}

async function resolveCollection(
  collection: HomeCollectionItem,
): Promise<HomeCollectionView | null> {
  if (collection.status === false) {
    return null;
  }

  let products =
    collection.productIds.length > 0 ? await getProductsByIds(collection.productIds) : [];

  if (products.length === 0) {
    products = FALLBACK_COLLECTIONS_BY_ID[collection.id] ?? [];
  }

  if (products.length === 0) {
    return null;
  }

  return {
    id: collection.id,
    tag: collection.tag,
    title: collection.title,
    description: collection.description,
    status: true,
    products,
  };
}

function buildFallbackCollections(): HomeCollectionView[] {
  return [
    {
      id: DEFAULT_TODAYS_DEAL_COLLECTION.id ?? "todays-deal",
      tag: DEFAULT_TODAYS_DEAL_COLLECTION.tag,
      title: DEFAULT_TODAYS_DEAL_COLLECTION.title,
      description: DEFAULT_TODAYS_DEAL_COLLECTION.description,
      status: DEFAULT_TODAYS_DEAL_COLLECTION.status !== false,
      products: FALLBACK_TODAYS_DEAL_PRODUCTS,
    },
  ];
}
