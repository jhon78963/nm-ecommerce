import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InstitutionalPageContent } from "@/features/institutional/components/InstitutionalPageContent";
import {
  getInstitutionalPageMeta,
  INSTITUTIONAL_SLUGS,
  isInstitutionalSlug,
} from "@/features/institutional/constants/institutional-pages";

export function generateStaticParams() {
  return INSTITUTIONAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const meta = getInstitutionalPageMeta(slug);

  if (!meta) {
    return {};
  }

  return {
    title: `${meta.title} | Novedades Maritex`,
    description: meta.description,
  };
}

export default async function InstitutionalRoute({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;

  if (!isInstitutionalSlug(slug)) {
    notFound();
  }

  return <InstitutionalPageContent slug={slug} />;
}
