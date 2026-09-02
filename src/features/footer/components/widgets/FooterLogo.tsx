import Link from "next/link";

import { DEFAULT_BRAND_NAME } from "@/features/navigation/constants/branding";

export function FooterLogo() {
  return (
    <Link href="/" className="footer-logo" aria-label={DEFAULT_BRAND_NAME}>
      <span className="footer-logo__initials">NM</span>
      <span className="footer-logo__name">{DEFAULT_BRAND_NAME}</span>
    </Link>
  );
}
