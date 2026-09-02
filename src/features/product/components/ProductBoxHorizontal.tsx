import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import {
  formatProductBoxPrice,
  getProductBoxHref,
} from "@/features/product/utils/format-product-price";
import { cn } from "@/lib/utils";

interface ProductBoxHorizontalProps {
  product: ProductBoxItem;
  className?: string;
}

function ProductRating({ rating }: { rating: number | null }) {
  const value = rating ?? 0;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = value >= index + 1;

        return (
          <Star
            key={index}
            className={cn("h-3.5 w-3.5", filled ? "fill-theme text-theme" : "fill-[#ddd] text-[#ddd]")}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export function ProductBoxHorizontal({ product, className }: ProductBoxHorizontalProps) {
  const href = getProductBoxHref(product);

  return (
    <div
      className={cn(
        "flex gap-3 bg-white p-3 sm:gap-4 sm:p-4",
        className,
      )}
    >
      <Link href={href} className="shrink-0 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={250}
          className="h-[110px] w-[100px] object-cover transition-transform duration-500 hover:scale-[1.03] sm:h-[140px] sm:w-[130px] md:h-[170px] md:w-[170px] xl:h-[250px] xl:w-[200px]"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <ProductRating rating={product.ratingCount} />

        <Link
          href={href}
          className="mt-1 block truncate text-sm leading-tight font-medium text-[#222] no-underline transition-colors hover:text-theme sm:text-base"
        >
          {product.name}
        </Link>

        <h4 className="m-0 mt-1 flex flex-wrap items-center gap-2 text-base font-bold text-[#222] sm:text-lg xl:text-xl [&_del]:text-sm [&_del]:font-normal [&_del]:text-[#999]">
          {formatProductBoxPrice(product.salePrice)}
          {product.discount > 0 ? <del>{formatProductBoxPrice(product.price)}</del> : null}
        </h4>
      </div>
    </div>
  );
}
