import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { InstitutionalPageContent } from "@/features/institutional/components/InstitutionalPageContent";
import {
  getInstitutionalPageMeta,
  INSTITUTIONAL_SLUGS,
  isInstitutionalSlug,
} from "@/features/institutional/constants/institutional-pages";
import { ShopPage } from "@/features/shop/components/ShopPage";
import { SEARCH_COLLECTION_SLUG } from "@/features/shop/constants/shop.constants";
import {
  getShopCollectionBySlug,
  getShopCollectionProducts,
  getShopCollections,
} from "@/features/shop/services/shop.service";
import { parseSearchParams } from "@/features/shop/utils/shop-url.utils";
import { getSiteUrl } from "@/features/seo/constants/site-meta";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const collections = await getShopCollections();

  return [
    ...INSTITUTIONAL_SLUGS.map((slug) => ({ slug })),
    ...collections.map((collection) => ({ slug: collection.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/${slug}`;

  const institutionalMeta = getInstitutionalPageMeta(slug);
  if (institutionalMeta) {
    const title = `${institutionalMeta.title} | Novedades Maritex`;

    return {
      title,
      description: institutionalMeta.description,
      alternates: { canonical },
      openGraph: {
        title,
        description: institutionalMeta.description,
        url: canonical,
      },
    };
  }

  const collection = await getShopCollectionBySlug(slug);
  if (collection) {
    const title = `${collection.label} — Novedades Maritex`;
    const description =
      collection.description ??
      `Explora nuestra colección de ${collection.label.toLowerCase()}.`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
      },
    };
  }

  return {};
}

export default async function SlugRoute({ params, searchParams }: PageProps) {
  const { slug } = await params;

  if (slug === SEARCH_COLLECTION_SLUG) {
    const rawParams = await searchParams;
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(rawParams)) {
      if (Array.isArray(value)) {
        value.forEach((item) => query.append(key, item));
        continue;
      }

      if (value) {
        query.set(key, value);
      }
    }

    const suffix = query.toString();
    redirect(suffix ? `/search?${suffix}` : "/search");
  }

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
