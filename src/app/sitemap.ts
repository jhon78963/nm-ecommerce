import type { MetadataRoute } from "next";

import { buildSitemapEntries } from "@/features/seo/services/sitemap-urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries();
}
