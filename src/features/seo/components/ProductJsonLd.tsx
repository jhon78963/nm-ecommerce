import type { ProductDetail } from "@/features/product/types/product-detail.types";
import { JsonLd } from "@/features/seo/components/JsonLd";
import { getSiteUrl } from "@/features/seo/constants/site-meta";
import { getProductHref } from "@/lib/routes";
import { resolveStoreMediaUrl } from "@/utils/resolve-store-media-url";
import { resolveProductSlug } from "@/utils/product-slug";

interface ProductJsonLdProps {
  product: ProductDetail;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const siteUrl = getSiteUrl();
  const slug = resolveProductSlug(product);
  const productUrl = `${siteUrl}${getProductHref(slug)}`;
  const imageUrl = resolveStoreMediaUrl(product.imageUrl);
  const absoluteImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${siteUrl}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            name: product.name,
            description: product.description ?? product.shortDescription,
            image: absoluteImageUrl,
            sku: product.sku ?? product.id,
            offers: {
              "@type": "Offer",
              url: productUrl,
              priceCurrency: "PEN",
              price: product.salePrice > 0 ? product.salePrice : product.price,
              availability:
                product.stockStatus === "in_stock"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: product.name,
                item: productUrl,
              },
            ],
          },
        ],
      }}
    />
  );
}

export function getProductCanonicalUrl(product: ProductDetail): string {
  return `${getSiteUrl()}${getProductHref(resolveProductSlug(product))}`;
}
