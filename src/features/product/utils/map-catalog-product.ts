import type {
  CatalogProduct,
  PublicCatalogProductItem,
} from "@/features/product/types/catalog.types";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";

const PLACEHOLDER_PRODUCT_IMAGE_URL = "/placeholder-product.svg";

interface MapCatalogProductOptions {
  imageUrl?: string;
  galleryImageUrls?: string[];
}

export function mapPublicProductToProductBoxItem(
  product: PublicCatalogProductItem,
): ProductBoxItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl || PLACEHOLDER_PRODUCT_IMAGE_URL,
    galleryImageUrls:
      product.galleryImageUrls.length > 0
        ? product.galleryImageUrls
        : [product.imageUrl || PLACEHOLDER_PRODUCT_IMAGE_URL],
    price: product.price,
    salePrice: product.salePrice,
    discount: product.discount,
    ratingCount: product.ratingCount,
    reviewsCount: product.reviewsCount,
    stockStatus: product.stockStatus,
  };
}

export function mapCatalogProductToProductBoxItem(
  product: CatalogProduct,
  options: MapCatalogProductOptions = {},
): ProductBoxItem {
  const sizes = product.sizes ?? [];
  const salePrices = sizes.map((size) => size.salePrice).filter((price) => price > 0);
  const price = salePrices.length > 0 ? Math.max(...salePrices) : 0;
  const salePrice = salePrices.length > 0 ? Math.min(...salePrices, price) : 0;
  const imageUrl = options.imageUrl ?? PLACEHOLDER_PRODUCT_IMAGE_URL;
  const galleryImageUrls =
    options.galleryImageUrls && options.galleryImageUrls.length > 0
      ? options.galleryImageUrls
      : [imageUrl];

  const discount =
    product.isOnSale && price > salePrice
      ? Math.round(((price - salePrice) / price) * 100)
      : 0;

  const stockStatus = sizes.some((size) => size.stock > 0) ? "in_stock" : "out_of_stock";

  return {
    id: product.id,
    slug: product.barcode ?? product.id,
    name: product.name,
    imageUrl,
    galleryImageUrls,
    price,
    salePrice,
    discount,
    ratingCount: null,
    reviewsCount: 0,
    stockStatus,
  };
}
