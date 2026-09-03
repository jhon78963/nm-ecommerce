"use client";

import { useState } from "react";

import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import type { ProductDetail } from "@/features/product/types/product-detail.types";
import { cn } from "@/lib/utils";

interface PdpProductTabsProps {
  product: ProductDetail;
}

type TabId = "description" | "info" | "reviews";

const TABS: { id: TabId; label: string }[] = [
  { id: "description", label: PDP_COPY.tabDescription },
  { id: "info", label: PDP_COPY.tabAdditionalInfo },
  { id: "reviews", label: PDP_COPY.tabReviews },
];

function DescriptionTab({ description }: { description?: string }) {
  if (!description) {
    return <p className="pdp-no-content">{PDP_COPY.noDescription}</p>;
  }

  return (
    <div
      className="pdp-tab-content"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
}

function AdditionalInfoTab({ product }: { product: ProductDetail }) {
  const rows = [
    product.sku && { label: "SKU", value: product.sku },
    product.genderLabel && { label: "Género", value: product.genderLabel },
    { label: "Estado", value: product.stockStatus === "in_stock" ? "En stock" : "Sin stock" },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="pdp-tab-content space-y-4">
      {product.additionalInfo ? (
        <div dangerouslySetInnerHTML={{ __html: product.additionalInfo }} />
      ) : null}

      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-gray-100">
              <td className="py-3 pr-8 font-semibold text-gray-700 w-40">{row.label}</td>
              <td className="py-3 text-gray-500">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReviewsTab({ reviewsCount }: { reviewsCount: number }) {
  return (
    <div className="pdp-tab-content">
      {reviewsCount === 0 ? (
        <p className="pdp-no-content">{PDP_COPY.noReviews}</p>
      ) : (
        <p className="text-gray-500">
          Este producto tiene {reviewsCount} reseñas. Integración con backend pendiente.
        </p>
      )}
    </div>
  );
}

export function PdpProductTabs({ product }: PdpProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  return (
    <div className="pdp-tabs-section">
      <div className="mx-auto w-full max-w-[1400px] px-[15px]">
        <nav className="pdp-tabs-nav" role="tablist" aria-label="Detalles del producto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`pdp-tab-${tab.id}`}
              aria-controls={`pdp-tabpanel-${tab.id}`}
              aria-selected={activeTab === tab.id}
              className={cn("pdp-tab-btn", activeTab === tab.id && "pdp-tab-btn--active")}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div
          id={`pdp-tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`pdp-tab-${activeTab}`}
        >
          {activeTab === "description" ? (
            <DescriptionTab description={product.description} />
          ) : activeTab === "info" ? (
            <AdditionalInfoTab product={product} />
          ) : (
            <ReviewsTab reviewsCount={product.reviewsCount} />
          )}
        </div>
      </div>
    </div>
  );
}
