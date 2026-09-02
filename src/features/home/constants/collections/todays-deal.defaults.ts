import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import type { ProductCollectionConfig } from "@/features/home/types/collection.types";

/** marketplace_one.json → content.product_list_1 */
export const DEFAULT_TODAYS_DEAL_COLLECTION: ProductCollectionConfig = {
  id: "todays-deal",
  tag: "special offer",
  title: "today's deal",
  status: true,
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
  productIds: [34, 279, 95, 451, 10],
};

/** multikart-front/public/assets/data/product.json — mismos IDs que product_list_1 */
export const FALLBACK_TODAYS_DEAL_PRODUCTS: ProductBoxItem[] = [
  {
    id: 34,
    name: "Prisma Dinning Chair",
    slug: "prisma-dinning-chair",
    imageUrl: "/placeholder-product.svg",
    galleryImageUrls: [
      "/placeholder-product.svg",
      "/placeholder-product.svg",
      "/placeholder-product.svg",
    ],
    price: 14,
    salePrice: 13.72,
    discount: 2,
    ratingCount: null,
    reviewsCount: 0,
    stockStatus: "in_stock",
  },
  {
    id: 279,
    name: "Muscle Blaze Sipper",
    slug: "muscle-blaze-sipper",
    imageUrl: "/placeholder-product.svg",
    galleryImageUrls: [
      "/placeholder-product.svg",
      "/placeholder-product.svg",
      "/placeholder-product.svg",
    ],
    price: 18,
    salePrice: 17.64,
    discount: 2,
    ratingCount: null,
    reviewsCount: 0,
    stockStatus: "in_stock",
  },
  {
    id: 95,
    name: "Fitted T-shirt",
    slug: "fitted-t-shirt",
    imageUrl: "/placeholder-product.svg",
    galleryImageUrls: [
      "/placeholder-product.svg",
      "/placeholder-product.svg",
      "/placeholder-product.svg",
    ],
    price: 10,
    salePrice: 9.5,
    discount: 5,
    ratingCount: null,
    reviewsCount: 0,
    stockStatus: "in_stock",
  },
  {
    id: 451,
    name: "Samba Heritage Shoes",
    slug: "samba-heritage-shoes",
    imageUrl: "/placeholder-product.svg",
    galleryImageUrls: [
      "/placeholder-product.svg",
      "/placeholder-product.svg",
      "/placeholder-product.svg",
    ],
    price: 20,
    salePrice: 18,
    discount: 10,
    ratingCount: null,
    reviewsCount: 0,
    stockStatus: "in_stock",
  },
  {
    id: 10,
    name: "Tan Cargo Shorts",
    slug: "tan-cargo-shorts",
    imageUrl: "/placeholder-product.svg",
    galleryImageUrls: [
      "/placeholder-product.svg",
      "/placeholder-product.svg",
      "/placeholder-product.svg",
    ],
    price: 12,
    salePrice: 9.96,
    discount: 17,
    ratingCount: null,
    reviewsCount: 0,
    stockStatus: "in_stock",
  },
];
