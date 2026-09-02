import Link from "next/link";

import type { FooterCategoryItem } from "@/features/footer/types/footer.types";

interface FooterCategoriesProps {
  categories: FooterCategoryItem[];
}

export function FooterCategories({ categories }: FooterCategoriesProps) {
  if (categories.length === 0) {
    return <p className="no-data-footer">Sin enlaces configurados.</p>;
  }

  return (
    <ul className="footer-link-list">
      {categories.map((category) => (
        <li key={category.id}>
          <Link href={category.href} className="text-content">
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
