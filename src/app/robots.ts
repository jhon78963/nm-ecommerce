import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/features/seo/constants/site-meta";
import { buildSitemapEntries } from "@/features/seo/services/sitemap-urls";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/checkout",
        "/carrito",
        "/micuenta",
        "/pedido",
        "/api",
        "/search",
        "/buscar",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
