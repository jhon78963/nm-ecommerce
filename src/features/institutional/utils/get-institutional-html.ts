import { readFileSync } from "node:fs";
import path from "node:path";

import type { InstitutionalSlug } from "@/features/institutional/constants/institutional-pages";
import { localizeInstitutionalHtml } from "@/features/institutional/utils/localize-institutional-html";

export function getInstitutionalHtml(slug: InstitutionalSlug): string {
  const filePath = path.join(
    process.cwd(),
    "src/features/institutional/content",
    `${slug}.html`,
  );

  const raw = readFileSync(filePath, "utf8");
  return localizeInstitutionalHtml(raw);
}
