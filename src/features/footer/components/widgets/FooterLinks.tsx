import Link from "next/link";

import type { FooterLinkItem } from "@/features/footer/types/footer.types";

interface FooterLinksProps {
  links: FooterLinkItem[];
}

export function FooterLinks({ links }: FooterLinksProps) {
  if (links.length === 0) {
    return <p className="no-data-footer">No link found.</p>;
  }

  return (
    <ul className="footer-link-list">
      {links.map((link) => (
        <li key={link.id}>
          <Link href={link.href} className="text-content">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
