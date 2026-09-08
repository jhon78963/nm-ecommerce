import type { Metadata } from "next";

import { PRIVATE_PAGE_ROBOTS } from "@/features/seo/constants/site-meta";
import { SearchLandingSection } from "@/features/search/components/SearchLandingSection";
import { ShopPage } from "@/features/shop/components/ShopPage";
import {
  getShopCollectionProducts,
  getShopCollections,
} from "@/features/shop/services/shop.service";
import { SEARCH_COLLECTION, SEARCH_COLLECTION_SLUG } from "@/features/shop/constants/shop.constants";
import { parseSearchParams } from "@/features/shop/utils/shop-url.utils";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function buildSearchTitle(query: string): string {
  return query ? `Resultados para "${query}"` : "Buscar productos";
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const rawParams = await searchParams;
  const filters = parseSearchParams(rawParams);
  const title = buildSearchTitle(filters.q);

  return {
    title: `${title} | Novedades Maritex`,
    description: "Encuentra productos en Novedades Maritex.",
    robots: PRIVATE_PAGE_ROBOTS,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const rawParams = await searchParams;
  const filters = parseSearchParams(rawParams);

  if (!filters.q) {
    return <SearchLandingSection />;
  }

  const [collections, { products, totalCount, facets }] = await Promise.all([
    getShopCollections(),
    getShopCollectionProducts(SEARCH_COLLECTION_SLUG, filters),
  ]);

  const collection = {
    ...SEARCH_COLLECTION,
    label: buildSearchTitle(filters.q),
  };

  return (
    <ShopPage
      collection={collection}
      products={products}
      collections={collections}
      totalCount={totalCount}
      currentPage={filters.page}
      facets={facets}
    />
  );
}
