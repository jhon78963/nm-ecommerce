import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import type {
  HomeCollectionItem,
  HomeCollectionView,
  PublicCollectionsResponse,
} from "@/features/home/types/collection.types";
import { getProductsByIds } from "@/features/product/services/catalog.service";
import { apiGet } from "@/services/http-client";

export async function getHomeCollections(): Promise<HomeCollectionView[]> {
  try {
    const response = await apiGet<PublicCollectionsResponse>("ecommerce/home/collections", {
      revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
    });

    if (!response.collections?.length) {
      return [];
    }

    const collections = await Promise.all(
      response.collections.map((collection) => resolveCollection(collection)),
    );

    return collections.filter(
      (collection): collection is HomeCollectionView => collection !== null,
    );
  } catch {
    return [];
  }
}

async function resolveCollection(
  collection: HomeCollectionItem,
): Promise<HomeCollectionView | null> {
  if (collection.status === false) {
    return null;
  }

  const products =
    collection.productIds.length > 0 ? await getProductsByIds(collection.productIds) : [];

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
