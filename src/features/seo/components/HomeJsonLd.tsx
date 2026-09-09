import { JsonLd } from "@/features/seo/components/JsonLd";
import { getSiteUrl, SITE_META } from "@/features/seo/constants/site-meta";
import { ROUTES } from "@/lib/routes";

export function HomeJsonLd() {
  const siteUrl = getSiteUrl();

  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Novedades Maritex",
          url: siteUrl,
          description: SITE_META.description,
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Novedades Maritex",
          url: siteUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: `${siteUrl}${ROUTES.search}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
      ]}
    />
  );
}
