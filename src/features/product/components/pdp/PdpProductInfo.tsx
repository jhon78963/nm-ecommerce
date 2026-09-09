"use client";

import { useMemo } from "react";

import { PDP_COPY } from "@/features/product/constants/pdp-copy";
import { useProductStock } from "@/features/product/hooks/use-product-stock";
import type { ProductDetail } from "@/features/product/types/product-detail.types";
import { enrichProductWithVariants } from "@/features/product/utils/enrich-product-variants";

interface PdpProductInfoProps {
  product: ProductDetail;
}

export function PdpProductInfo({ product }: PdpProductInfoProps) {
  const enrichedProduct = useMemo(() => enrichProductWithVariants(product), [product]);
  const { stockStatus } = useProductStock(String(product.id), enrichedProduct.sizes);
  const isInStock = stockStatus === "in_stock";

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
            {isInStock ? PDP_COPY.inStock : PDP_COPY.outOfStock}
          </span>
        </li>
      </ul>
    </div>
  );
}
