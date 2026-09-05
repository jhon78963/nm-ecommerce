import type { MetadataRoute } from "next";

import { env } from "@/config/env";
import { INSTITUTIONAL_SLUGS } from "@/features/institutional/constants/institutional-pages";
import { SEARCH_COLLECTION_SLUG } from "@/features/shop/constants/shop.constants";
import { getShopCollectionProducts, getShopCollections } from "@/features/shop/services/shop.service";
import { getProductHref } from "@/lib/routes";
import { resolveProductSlug } from "@/utils/product-slug";

const SITEMAP_PRODUCTS_PER_PAGE = 100;
const MAX_SITEMAP_PRODUCT_PAGES = 20;

async function collectProductUrls(baseUrl: string, lastModified: Date): Promise<MetadataRoute.Sitemap> {
  const collections = await getShopCollections();
  const productUrls = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const collection of collections) {
    if (collection.slug === SEARCH_COLLECTION_SLUG) {
      continue;
    }

    for (let page = 1; page <= MAX_SITEMAP_PRODUCT_PAGES; page += 1) {
      const result = await getShopCollectionProducts(collection.slug, {
        page,
        sort: "featured",
        tallas: [],
        colores: [],
        q: "",
        onSale: false,
        minPrice: undefined,
        maxPrice: undefined,
      });

      if (result.products.length === 0) {
        break;
      }

      for (const product of result.products) {
        const slug = resolveProductSlug(product);
        productUrls.set(slug, {
          url: `${baseUrl}${getProductHref(slug)}`,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }

      if (result.products.length < SITEMAP_PRODUCTS_PER_PAGE) {
        break;
      }
    }
  }

  return [...productUrls.values()];
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.appUrl.replace(/\/$/, "");
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...INSTITUTIONAL_SLUGS.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const collections = await getShopCollections();
  for (const collection of collections) {
    if (collection.slug === SEARCH_COLLECTION_SLUG) {
      continue;
    }

    entries.push({
      url: `${baseUrl}/${collection.slug}`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  entries.push(...(await collectProductUrls(baseUrl, lastModified)));

  return entries;
}
