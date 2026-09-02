import Link from "next/link";

import { resolveCollectionSlug } from "@/features/shop/constants/shop.constants";
import { ROUTES } from "@/lib/routes";
import type { SearchGender } from "@/features/search/types/search.types";

interface SearchCategoryLinksProps {
  genders: SearchGender[];
  onNavigate: () => void;
}

export function SearchCategoryLinks({ genders, onNavigate }: SearchCategoryLinksProps) {
  if (genders.length === 0) return null;

  return (
    <div className="search-category-box mt-2.5">
      <ul className="search-category-skeleton flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
        <li className="font-medium text-[#6a6a6a]">Búsquedas top:</li>
        {genders.map((gender) => (
          <li key={gender.id}>
            <Link
              href={ROUTES.collection(resolveCollectionSlug(gender.description))}
              onClick={onNavigate}
              className="font-medium text-theme hover:underline"
            >
              {gender.description}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
