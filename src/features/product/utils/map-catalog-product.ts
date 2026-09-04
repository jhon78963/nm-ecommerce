import type {
  CatalogProduct,
  PublicCatalogProductItem,
} from "@/features/product/types/catalog.types";
import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import type { ProductDetail } from "@/features/product/types/product-detail.types";
import type { ProductSize } from "@/features/product/types/product-variant.types";
import { buildProductSlug, resolveProductSlug } from "@/utils/product-slug";
import { resolveStoreMediaUrl } from "@/utils/resolve-store-media-url";

const PLACEHOLDER_PRODUCT_IMAGE_URL = "/placeholder-product.svg";

interface MapCatalogProductOptions {
  imageUrl?: string;
  galleryImageUrls?: string[];
}

function mapPublicSizes(sizes: PublicCatalogProductItem["sizes"]): ProductSize[] | undefined {
  if (!sizes) {
    return undefined;
  }

  return sizes.map((size) => ({
    id: size.id,
    label: size.label,
    stock: size.stock,
    salePrice: size.salePrice,
    colors: size.colors.map((color) => ({
      id: color.id,
      label: color.label,
      hex: color.hex,
      stock: color.stock,
    })),
  }));
}

export function mapPublicProductToProductBoxItem(
  product: PublicCatalogProductItem,
): ProductBoxItem {
  return {
    id: product.id,
    slug: resolveProductSlug({
      id: product.id,
      name: product.name,
      slug: product.slug,
    }),
    name: product.name,
    imageUrl: resolveStoreMediaUrl(product.imageUrl) || PLACEHOLDER_PRODUCT_IMAGE_URL,
    galleryImageUrls:
      product.galleryImageUrls.length > 0
        ? product.galleryImageUrls.map((url) => resolveStoreMediaUrl(url))
        : [resolveStoreMediaUrl(product.imageUrl) || PLACEHOLDER_PRODUCT_IMAGE_URL],
    price: product.price,
    salePrice: product.salePrice,
    discount: product.discount,
    ratingCount: product.ratingCount,
    reviewsCount: product.reviewsCount,
    stockStatus: product.stockStatus,
    shortDescription: product.shortDescription ?? undefined,
    isFeatured: product.isFeatured ?? false,
    isOnSale: product.isOnSale ?? false,
    isNew: product.isNew ?? false,
    cashDiscount: product.cashDiscount ?? undefined,
    percentageDiscount: product.percentageDiscount
      ? Number(product.percentageDiscount) || undefined
      : undefined,
    sku: product.barcode ?? undefined,
    sizes: mapPublicSizes(product.sizes),
  };
}

export function mapPublicProductToProductDetail(
  product: PublicCatalogProductItem,
): ProductDetail {
  const box = mapPublicProductToProductBoxItem(product);

  return {
    ...box,
    description: product.description ?? undefined,
    additionalInfo: product.additionalInfo ?? undefined,
    sku: product.barcode ?? undefined,
    genderLabel: product.genderLabel ?? undefined,
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
  const imageUrl = resolveStoreMediaUrl(options.imageUrl) || PLACEHOLDER_PRODUCT_IMAGE_URL;
  const galleryImageUrls =
    options.galleryImageUrls && options.galleryImageUrls.length > 0
      ? options.galleryImageUrls.map((url) => resolveStoreMediaUrl(url))
      : [imageUrl];

  const discount =
    product.isOnSale && price > salePrice
      ? Math.round(((price - salePrice) / price) * 100)
      : 0;

  const stockStatus = sizes.some((size) => size.stock > 0) ? "in_stock" : "out_of_stock";

  return {
    id: product.id,
    slug: buildProductSlug(product.name, product.id),
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
