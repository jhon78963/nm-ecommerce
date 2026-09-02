import type {
  ProductDetailColor,
  ProductDetailSize,
} from "@/features/product/types/product-detail.types";

/**
 * STUB DATA — Solo para desarrollo UI.
 * Reemplazar con datos reales del backend cuando el endpoint los exponga.
 * Ver: backend-map.md → GET /ecommerce/products/public/by-slug/:slug
 */

const STUB_COLORS: ProductDetailColor[] = [
  { id: "c-negro", label: "Negro", hex: "#1a1a1a" },
  { id: "c-blanco", label: "Blanco", hex: "#f0ede8" },
  { id: "c-marino", label: "Azul Marino", hex: "#1a2a5e" },
  { id: "c-rojo", label: "Rojo", hex: "#c62828" },
  { id: "c-verde", label: "Verde Militar", hex: "#4a5e3a" },
  { id: "c-gris", label: "Gris", hex: "#8a8a8a" },
  { id: "c-beige", label: "Beige", hex: "#d4c5a9" },
  { id: "c-mostaza", label: "Mostaza", hex: "#d4a430" },
  { id: "c-celeste", label: "Celeste", hex: "#5eb8d4" },
  { id: "c-rosado", label: "Rosado", hex: "#e07a99" },
];

export const STUB_PRODUCT_SIZES: ProductDetailSize[] = [
  {
    id: "sz-xs",
    label: "XS",
    stock: 4,
    colors: [STUB_COLORS[0], STUB_COLORS[1], STUB_COLORS[2]],
  },
  {
    id: "sz-s",
    label: "S",
    stock: 11,
    colors: [STUB_COLORS[0], STUB_COLORS[1], STUB_COLORS[2], STUB_COLORS[3], STUB_COLORS[5]],
  },
  {
    id: "sz-m",
    label: "M",
    stock: 9,
    colors: [
      STUB_COLORS[0],
      STUB_COLORS[1],
      STUB_COLORS[2],
      STUB_COLORS[3],
      STUB_COLORS[4],
      STUB_COLORS[5],
      STUB_COLORS[6],
      STUB_COLORS[7],
    ],
  },
  {
    id: "sz-l",
    label: "L",
    stock: 3,
    colors: [STUB_COLORS[0], STUB_COLORS[2], STUB_COLORS[6], STUB_COLORS[7], STUB_COLORS[8]],
  },
  {
    id: "sz-xl",
    label: "XL",
    stock: 0,
    colors: [],
  },
  {
    id: "sz-xxl",
    label: "XXL",
    stock: 6,
    colors: [STUB_COLORS[0], STUB_COLORS[1], STUB_COLORS[9]],
  },
];
