import Link from "next/link";
import Image from "next/image";

import type { SearchProduct } from "@/features/search/types/search.types";
import { formatProductPrice, getProductHref } from "@/features/search/utils/product";
import { cn } from "@/lib/utils";

interface SearchProductCardProps {
  product: SearchProduct;
  onNavigate: () => void;
}

export function SearchProductCard({ product, onNavigate }: SearchProductCardProps) {
  const href = getProductHref(product);
  const isOutOfStock = product.sizes?.every((size) => size.stock <= 0) ?? true;

  return (
    <article className={cn("basic-product group", isOutOfStock && "opacity-70")}>
      <div className="img-wrapper relative overflow-hidden bg-[#f8f8f8]">
        <Link href={href} onClick={onNavigate} className="block aspect-square">
          <div className="flex h-full items-center justify-center p-4">
            <Image
              src="/placeholder-product.svg"
              alt={product.name}
              width={200}
              height={200}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        <ul className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isOnSale ? (
            <li className="bg-theme px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
              Oferta
            </li>
          ) : null}
          {product.isFeatured ? (
            <li className="bg-[#222] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
              Destacado
            </li>
          ) : null}
          {isOutOfStock ? (
            <li className="bg-[#777] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
              Agotado
            </li>
          ) : null}
        </ul>
      </div>

      <div className="product-detail mt-3">
        <Link href={href} onClick={onNavigate}>
          <h6 className="line-clamp-2 text-sm font-medium text-[#222] transition-colors group-hover:text-theme">
            {product.name}
          </h6>
        </Link>
        <p className="price mt-1 text-base font-semibold text-theme">{formatProductPrice(product)}</p>
      </div>
    </article>
  );
}
