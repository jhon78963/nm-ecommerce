import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InstitutionalPageContent } from "@/features/institutional/components/InstitutionalPageContent";
import {
  getInstitutionalPageMeta,
  INSTITUTIONAL_SLUGS,
  isInstitutionalSlug,
} from "@/features/institutional/constants/institutional-pages";
import { ShopPage } from "@/features/shop/components/ShopPage";
import {
  getShopCollectionBySlug,
  getShopCollectionProducts,
  getShopCollections,
} from "@/features/shop/services/shop.service";
import { parseSearchParams } from "@/features/shop/utils/shop-url.utils";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  const collections = await getShopCollections();

  return [
    ...INSTITUTIONAL_SLUGS.map((slug) => ({ slug })),
    ...collections.map((collection) => ({ slug: collection.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const institutionalMeta = getInstitutionalPageMeta(slug);
  if (institutionalMeta) {
    return {
      title: `${institutionalMeta.title} | Novedades Maritex`,
      description: institutionalMeta.description,
    };
  }

  const collection = await getShopCollectionBySlug(slug);
  if (collection) {
    return {
      title: `${collection.label} — Novedades Maritex`,
      description:
        collection.description ??
        `Explora nuestra colección de ${collection.label.toLowerCase()}.`,
    };
  }

  return {};
}

export default async function SlugRoute({ params, searchParams }: PageProps) {
  const { slug } = await params;

  if (isInstitutionalSlug(slug)) {
    return <InstitutionalPageContent slug={slug} />;
  }

  const [collection, collections, rawParams] = await Promise.all([
    getShopCollectionBySlug(slug),
    getShopCollections(),
    searchParams,
  ]);

  if (!collection) {
    notFound();
  }

  const filters = parseSearchParams(rawParams);
  const { products, totalCount, facets } = await getShopCollectionProducts(slug, filters);

  return (
    <ShopPage
      collection={collection}
      collections={collections}
      products={products}
      totalCount={totalCount}
      currentPage={filters.page}
      facets={facets}
    />
  );
}
