import type { Metadata } from "next";

import { env } from "@/config/env";

export const SITE_META = {
  siteTitle: "Novedades Maritex | Estilo y Variedad",
  siteTagline: "Las mejores tendencias y precios increíbles en un solo lugar.",
  description:
    "Descubre Novedades Maritex en el Mercado Mayorista de Trujillo (Puesto C-74). Ofrecemos ropa de moda, casual y de temporada para toda la familia con los mejores precios del mercado.",
  locale: "es_PE",
  exitTaglineEnabled: true,
  taglines: ["⚡ ¡Te extrañamos!", "🎉 Ofertas para ti..."],
  messageDelayMs: 1000,
} as const;

export function getSiteUrl(): string {
  return env.appUrl.replace(/\/$/, "");
}

export function getDefaultDocumentTitle() {
  return `${SITE_META.siteTitle} | ${SITE_META.siteTagline}`;
}

export function buildDefaultOpenGraph(): NonNullable<Metadata["openGraph"]> {
  const siteUrl = getSiteUrl();

  return {
    type: "website",
    locale: SITE_META.locale,
    url: siteUrl,
    siteName: "Novedades Maritex",
    title: getDefaultDocumentTitle(),
    description: SITE_META.description,
  };
}

export function buildDefaultTwitter(): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title: getDefaultDocumentTitle(),
    description: SITE_META.description,
  };
}

export const PRIVATE_PAGE_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
};

export function buildPrivatePageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: PRIVATE_PAGE_ROBOTS,
  };
}
