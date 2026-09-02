import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import type { ProductDetail } from "@/features/product/types/product-detail.types";

interface PdpProductInfoProps {
  product: ProductDetail;
}

export function PdpProductInfo({ product }: PdpProductInfoProps) {
  const isInStock = product.stockStatus === "in_stock";

  return (
    <div className="bordered-box">
      <h4 className="sub-title">{PDP_COPY.productInfoTitle}</h4>
      <ul className="shipping-info">
        {product.sku ? (
          <li>
            <span>{PDP_COPY.skuLabel}: </span>
            {product.sku}
          </li>
        ) : null}

        <li>
          <span>{PDP_COPY.stockLabel}: </span>
          <span className={isInStock ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
            {isInStock ? PDP_COPY.inStock : PDP_COPY.outOfStockLabel}
          </span>
        </li>
      </ul>
    </div>
  );
}
