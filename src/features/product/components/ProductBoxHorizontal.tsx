import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import {
  formatProductBoxPrice,
  getProductBoxHref,
} from "@/features/product/utils/format-product-price";
import { hasProductPromoPrice } from "@/features/product/utils/product-discount-badge";
import { cn } from "@/lib/utils";

import "./product-box-horizontal.css";

interface ProductBoxHorizontalProps {
  product: ProductBoxItem;
  className?: string;
}

function ProductRating({ rating }: { rating: number | null }) {
  const value = rating ?? 0;

  return (
    <div className="rating">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = value >= index + 1;

        return (
          <Star
            key={index}
            className={cn("rating__star", filled ? "is-filled" : "is-empty")}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export function ProductBoxHorizontal({ product, className }: ProductBoxHorizontalProps) {
  const href = getProductBoxHref(product);
  const hasDiscount = hasProductPromoPrice(product) && product.price > product.salePrice;

  return (
    <div className={cn("product-box-horizontal media", className)}>
      <Link href={href} className="product-box-horizontal__image-link">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={95}
          height={95}
          className="product-box-horizontal__image"
        />
      </Link>

      <div className="media-body align-self-center">
        <ProductRating rating={product.ratingCount} />

        <Link href={href} className="product-box-horizontal__title-link">
          <h6 className="product-box-horizontal__title">{product.name}</h6>
        </Link>

        <h4 className="product-box-horizontal__price">
          {hasDiscount ? (
            <>
              {formatProductBoxPrice(product.salePrice)}
              <del>{formatProductBoxPrice(product.price)}</del>
            </>
          ) : (
            formatProductBoxPrice(product.price)
          )}
        </h4>
      </div>
    </div>
  );
}
