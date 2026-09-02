import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { ShopCollection } from "../../types/shop.types";

interface CollectionFilterProps {
  collections: ShopCollection[];
  activeSlug?: string;
}

export function CollectionFilter({ collections, activeSlug }: CollectionFilterProps) {
  return (
    <ul className="m-0 list-none space-y-0.5 p-0">
      {collections.map((collection) => {
        const isActive = activeSlug === collection.slug;
        return (
          <li key={collection.slug}>
            <Link
              href={ROUTES.collection(collection.slug)}
              className={cn(
                "flex items-center gap-2 py-1.5 text-[13px] text-[#555] transition-colors hover:text-theme",
                isActive && "font-semibold text-theme",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-current opacity-0 transition-opacity",
                  isActive && "opacity-100",
                )}
              />
              {collection.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
