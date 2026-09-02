import type { ProductBoxItem } from "@/features/product/types/product-box.types";
import type {
  CategoryProductTab,
  HomeCategoryProductSectionConfig,
  HomeCategoryProductSectionView,
} from "@/features/home/types/category-product.types";
import { ROUTES } from "@/lib/routes";

export const CATEGORY_PRODUCT_REVALIDATE_SECONDS = 300;

/** marketplace_one.json → content.category_product */
export const DEFAULT_CATEGORY_PRODUCT_SECTION: HomeCategoryProductSectionConfig = {
  status: true,
  leftPanel: {
    title: "Menos de S/ 20",
    status: true,
    productIds: [117, 114, 112, 74, 34],
  },
  rightPanel: {
    productBanner: {
      status: true,
      imageUrl: "/images/theme/marketplace_one/marketplace_one_7.png",
      href: ROUTES.shop,
      alt: "Banner de categoría",
    },
    productCategory: {
      title: "RECOMENDACIONES PARA TI",
      status: true,
      tabs: [
        { id: "29", name: "Muebles", slug: "muebles", productIds: [] },
        { id: "30", name: "Decoración", slug: "decoracion", productIds: [] },
        { id: "115", name: "Hogar", slug: "hogar", productIds: [] },
      ],
    },
  },
};

export const FALLBACK_CATEGORY_TABS: CategoryProductTab[] = [
  { id: "29", name: "Muebles", slug: "muebles" },
  { id: "30", name: "Decoración", slug: "decoracion" },
  { id: "115", name: "Hogar", slug: "hogar" },
];

function createFallbackProduct(
  id: number,
  name: string,
  slug: string,
  price: number,
  salePrice: number,
): ProductBoxItem {
  const discount = price > 0 ? Math.round(((price - salePrice) / price) * 100) : 0;

  return {
    id,
    name,
    slug,
    imageUrl: "/placeholder-product.svg",
    galleryImageUrls: ["/placeholder-product.svg"],
    price,
    salePrice,
    discount,
    ratingCount: null,
    reviewsCount: 0,
    stockStatus: "in_stock",
  };
}

export const FALLBACK_LEFT_PANEL_PRODUCTS: ProductBoxItem[] = [
  createFallbackProduct(117, "Silla de comedor Prisma", "prisma-dining-chair", 22, 18.5),
  createFallbackProduct(114, "Lámpara de mesa Nordic", "nordic-table-lamp", 19, 15.99),
  createFallbackProduct(112, "Set de cojines decorativos", "decorative-cushion-set", 16, 12.5),
  createFallbackProduct(74, "Organizador de escritorio", "desk-organizer", 14, 11.2),
  createFallbackProduct(34, "Silla Prisma", "prisma-dinning-chair", 14, 13.72),
];

export const FALLBACK_TAB_PRODUCTS: Record<string, ProductBoxItem[]> = {
  "29": [
    createFallbackProduct(201, "Mesa auxiliar Oslo", "mesa-auxiliar-oslo", 120, 99),
    createFallbackProduct(202, "Sillón lounge Urban", "sillon-lounge-urban", 180, 149),
    createFallbackProduct(203, "Estantería modular", "estanteria-modular", 95, 79),
    createFallbackProduct(204, "Banco de madera", "banco-de-madera", 65, 54),
    createFallbackProduct(205, "Mesa de centro", "mesa-de-centro", 110, 89),
  ],
  "30": [
    createFallbackProduct(301, "Cuadro abstracto", "cuadro-abstracto", 45, 38),
    createFallbackProduct(302, "Florero cerámico", "florero-ceramico", 28, 22),
    createFallbackProduct(303, "Espejo redondo", "espejo-redondo", 55, 46),
    createFallbackProduct(304, "Macetero minimal", "macetero-minimal", 24, 19),
    createFallbackProduct(305, "Lámpara de pie", "lampara-de-pie", 78, 65),
  ],
  "115": [
    createFallbackProduct(401, "Juego de toallas", "juego-de-toallas", 36, 29),
    createFallbackProduct(402, "Difusor de aromas", "difusor-de-aromas", 42, 35),
    createFallbackProduct(403, "Caja organizadora", "caja-organizadora", 18, 14.5),
    createFallbackProduct(404, "Alfombra suave", "alfombra-suave", 88, 72),
    createFallbackProduct(405, "Set de cojines", "set-de-cojines", 32, 26),
  ],
};

export function buildFallbackCategoryProductSection(): HomeCategoryProductSectionView {
  const config = DEFAULT_CATEGORY_PRODUCT_SECTION;

  return {
    status: config.status !== false,
    leftPanel:
      config.leftPanel?.status !== false
        ? {
            title: config.leftPanel!.title,
            status: true,
            products: FALLBACK_LEFT_PANEL_PRODUCTS,
          }
        : null,
    rightPanel: {
      productCategory: {
        title: config.rightPanel.productCategory.title,
        status: config.rightPanel.productCategory.status !== false,
        tabs: FALLBACK_CATEGORY_TABS,
        productsByCategoryId: FALLBACK_TAB_PRODUCTS,
      },
      productBanner: config.rightPanel.productBanner?.status !== false
        ? config.rightPanel.productBanner!
        : null,
    },
  };
}
