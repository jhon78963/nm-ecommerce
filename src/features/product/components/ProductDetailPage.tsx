import { Star } from "lucide-react";

import { formatPrice } from "@/features/cart/utils/format-price";
import { STUB_PRODUCT_SIZES } from "@/features/product/constants/pdp-stubs";
import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import { PdpBreadcrumb } from "@/features/product/components/pdp/PdpBreadcrumb";
import { PdpDeliveryInfo } from "@/features/product/components/pdp/PdpDeliveryInfo";
import { PdpGallery } from "@/features/product/components/pdp/PdpGallery";
import { PdpInteractivePanel } from "@/features/product/components/pdp/PdpInteractivePanel";
import { PdpProductInfo } from "@/features/product/components/pdp/PdpProductInfo";
import { PdpProductTabs } from "@/features/product/components/pdp/PdpProductTabs";
import { PdpSafeCheckout } from "@/features/product/components/pdp/PdpSafeCheckout";
import type { ProductDetail } from "@/features/product/types/product-detail.types";
import { cn } from "@/lib/utils";

import "@/features/product/components/quick-view/product-quick-view.css";
import "@/features/product/components/pdp/pdp.css";

interface ProductDetailPageProps {
  product: ProductDetail;
}

function PdpRating({ rating, reviewsCount }: { rating: number | null; reviewsCount: number }) {
  const value = rating ?? 0;

  return (
    <div className="product-rating">
      <div className="rating-list flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              "size-3.5",
              value >= index + 1 ? "fill-[#ffbc37] text-[#ffbc37]" : "fill-[#ddd] text-[#ddd]",
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="divider">|</span>
      <span>
        {reviewsCount} {PDP_COPY.reviews}
      </span>
    </div>
  );
}

function PdpPrice({
  salePrice,
  originalPrice,
  discount,
}: {
  salePrice: number;
  originalPrice: number;
  discount: number;
}) {
  return (
    <div className="price-text">
      <h3>
        {formatPrice(salePrice)}
        {discount > 0 ? (
          <>
            <del>{formatPrice(originalPrice)}</del>
            <span className="discounted-price">
              {discount}% {PDP_COPY.off}
            </span>
          </>
        ) : null}
      </h3>
      <span>{PDP_COPY.inclusiveText}</span>
    </div>
  );
}

/**
 * Enriquece el producto con stub de tallas/colores si el backend aún
 * no los expone. Eliminar `stubSizes` cuando el endpoint devuelva `sizes`.
 */
function enrichWithStubs(product: ProductDetail): ProductDetail {
  if (product.sizes && product.sizes.length > 0) {
    return product;
  }

  const stubSizes = STUB_PRODUCT_SIZES.map((size) => ({
    ...size,
    salePrice: product.salePrice,
  }));

  return { ...product, sizes: stubSizes };
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const enrichedProduct = enrichWithStubs(product);

  return (
    <>
      <section className="pdp-section">
        <div className="mx-auto w-full max-w-[1400px] px-[15px]">
          <div className="pdp-layout">
            {/* ── LEFT: Gallery ─────────────────────────────── */}
            <div className="pdp-gallery-col">
              <div className="pdp-gallery-sticky">
                <PdpGallery product={enrichedProduct} />
              </div>
            </div>

            {/* ── RIGHT: Product info ──────────────────────── */}
            <div className="pdp-info-col">
              <div className="product-page-details rtl-text">
                <PdpBreadcrumb
                  productName={enrichedProduct.name}
                  genderLabel={enrichedProduct.genderLabel}
                />

                <h1 className="main-title">{enrichedProduct.name}</h1>

                <PdpRating
                  rating={enrichedProduct.ratingCount}
                  reviewsCount={enrichedProduct.reviewsCount}
                />

                <PdpPrice
                  salePrice={enrichedProduct.salePrice}
                  originalPrice={enrichedProduct.price}
                  discount={enrichedProduct.discount}
                />

                <PdpInteractivePanel product={enrichedProduct} />

                <PdpDeliveryInfo />

                <PdpProductInfo product={enrichedProduct} />

                <PdpSafeCheckout />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs section ──────────────────────────────────── */}
      <PdpProductTabs product={enrichedProduct} />
    </>
  );
}
