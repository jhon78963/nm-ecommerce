import { STORE_CONTENT_REVALIDATE_SECONDS } from "@/config/store-content";
import { env } from "@/config/env";
import { mapPublicProductToProductBoxItem } from "@/features/product/utils/map-catalog-product";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import { apiGet } from "@/services/http-client";
import type {
  ParsedShopFilters,
  ShopCollection,
  ShopProductsFacets,
  ShopProductsResult,
} from "../types/shop.types";
import { FALLBACK_SHOP_COLLECTIONS, SHOP_PER_PAGE } from "../constants/shop.constants";

interface ShopCollectionApiItem {
  id: string;
  slug: string;
  label: string;
  description?: string;
  bannerImageUrl?: string;
  status: boolean;
  productIds: string[];
}

interface PublicShopCollectionsResponse {
  collections: ShopCollectionApiItem[];
}

interface ShopProductsApiResponse {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    galleryImageUrls: string[];
    price: number;
    salePrice: number;
    discount: number;
    stockStatus: "in_stock" | "out_of_stock";
    ratingCount: number | null;
    reviewsCount: number;
    sizes?: Array<{
      id: string;
      label: string;
      stock: number;
      salePrice: number;
      colors: Array<{
        id: string;
        label: string;
        hex: string;
        stock: number;
      }>;
    }>;
  }>;
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
  facets: ShopProductsFacets;
}

function mapCollection(item: ShopCollectionApiItem): ShopCollection {
  return {
    slug: item.slug,
    label: item.label,
    description: item.description,
    bannerImageUrl: item.bannerImageUrl,
  };
}

export async function getShopCollections(): Promise<ShopCollection[]> {
  try {
    const response = await apiGet<PublicShopCollectionsResponse>("ecommerce/shop/collections", {
      revalidate: STORE_CONTENT_REVALIDATE_SECONDS,
    });

    if (!response.collections?.length) {
      return FALLBACK_SHOP_COLLECTIONS;
    }

    return response.collections.map(mapCollection);
  } catch {
    return FALLBACK_SHOP_COLLECTIONS;
  }
}

export async function getShopCollectionBySlug(slug: string): Promise<ShopCollection | null> {
  const collections = await getShopCollections();
  return collections.find((collection) => collection.slug === slug) ?? null;
}

export async function getShopCollectionProducts(
  collectionSlug: string,
  filters: ParsedShopFilters,
): Promise<ShopProductsResult> {
  const warehouseId = env.storeWarehouseId;

  if (!warehouseId) {
    return {
      products: [],
      totalCount: 0,
      facets: { sizes: [], colors: [] },
    };
  }

  try {
    const response = await apiGet<ShopProductsApiResponse>("ecommerce/shop/products", {
      params: {
        collectionSlug,
        warehouseId,
        sizeIds: filters.tallas.length > 0 ? filters.tallas.join(",") : undefined,
        colorIds: filters.colores.length > 0 ? filters.colores.join(",") : undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
        page: filters.page,
        perPage: SHOP_PER_PAGE,
      },
      cache: "no-store",
    });

    return {
      products: response.products.map(mapPublicProductToProductBoxItem),
      totalCount: response.meta.total,
      facets: response.facets,
    };
  } catch (error) {
    console.error(`[shop] Failed to load products for "${collectionSlug}":`, error);
    return {
      products: [],
      totalCount: 0,
      facets: { sizes: [], colors: [] },
    };
  }
}
