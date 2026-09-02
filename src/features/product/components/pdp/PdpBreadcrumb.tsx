import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import { ROUTES } from "@/lib/routes";

interface PdpBreadcrumbProps {
  productName: string;
  genderLabel?: string;
}

export function PdpBreadcrumb({ productName, genderLabel }: PdpBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="pdp-breadcrumb">
        <li>
          <Link href="/">{PDP_COPY.breadcrumbHome}</Link>
        </li>

        <li aria-hidden="true">
          <ChevronRight className="pdp-breadcrumb__sep size-3" />
        </li>

        <li>
          <Link href={ROUTES.shop}>{PDP_COPY.breadcrumbShop}</Link>
        </li>

        {genderLabel ? (
          <>
            <li aria-hidden="true">
              <ChevronRight className="pdp-breadcrumb__sep size-3" />
            </li>
            <li>
              <Link href={`${ROUTES.shop}?genero=${encodeURIComponent(genderLabel.toLowerCase())}`}>
                {genderLabel}
              </Link>
            </li>
          </>
        ) : null}

        <li aria-hidden="true">
          <ChevronRight className="pdp-breadcrumb__sep size-3" />
        </li>

        <li>
          <span className="pdp-breadcrumb__current" aria-current="page">
            {productName}
          </span>
        </li>
      </ol>
    </nav>
  );
}
