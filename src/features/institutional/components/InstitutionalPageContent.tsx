import type { InstitutionalSlug } from "@/features/institutional/constants/institutional-pages";
import { InstitutionalHtmlContent } from "@/features/institutional/components/InstitutionalHtmlContent";
import { getInstitutionalHtml } from "@/features/institutional/utils/get-institutional-html";

import "../institutional.css";

interface InstitutionalPageContentProps {
  slug: InstitutionalSlug;
}

export function InstitutionalPageContent({ slug }: InstitutionalPageContentProps) {
  const html = getInstitutionalHtml(slug);

  return <InstitutionalHtmlContent html={html} slug={slug} />;
}
