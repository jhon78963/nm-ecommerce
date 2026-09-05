import type { Metadata } from "next";

import { HomePageContent } from "@/features/home/components/HomePageContent";
import { HomeJsonLd } from "@/features/seo/components/HomeJsonLd";
import { getDefaultDocumentTitle, SITE_META } from "@/features/seo/constants/site-meta";

export const metadata: Metadata = {
  title: getDefaultDocumentTitle(),
  description: SITE_META.description,
};

export default function Home() {
  return (
    <>
      <HomeJsonLd />
      <HomePageContent />
    </>
  );
}
