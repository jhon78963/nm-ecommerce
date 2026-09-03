import Link from "next/link";

import { ROUTES } from "@/lib/routes";
import type { SearchCollection } from "@/features/search/types/search.types";

interface SearchCategoryLinksProps {
  collections: SearchCollection[];
  onNavigate: () => void;
}

export function SearchCategoryLinks({ collections, onNavigate }: SearchCategoryLinksProps) {
  if (collections.length === 0) return null;

  return (
    <div className="search-category-box mt-2.5">
      <ul className="search-category-skeleton flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
        <li className="font-medium text-[#6a6a6a]">Búsquedas top:</li>
        {collections.map((collection) => (
          <li key={collection.id}>
            <Link
              href={ROUTES.collection(collection.slug)}
              onClick={onNavigate}
              className="font-medium text-theme hover:underline"
            >
              {collection.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
