export const PDP_COPY = {
  breadcrumbHome: "Inicio",
  breadcrumbShop: "Tienda",

  colorsLabel: "Color",
  sizesLabel: "Talla",
  guiaDeTallas: "Guía de tallas",
  selectedColor: (label: string) => `Color seleccionado: ${label}`,
  selectedSize: (label: string) => `Talla seleccionada: ${label}`,
  agotadoParaTalla: "Agotado en esta talla",

  mrp: "",
  inclusiveText: "Impuestos incluidos",
  off: "dto.",

  quantityLabel: "Cantidad",
  addToCart: "Agregar al carrito",
  buyNow: "Comprar ahora",
  outOfStock: "Agotado",
  addToWishlist: "Agregar a favoritos",
  removeFromWishlist: "En favoritos",
  share: "Compartir",
  compare: "Comparar",

  selectSizeFirst: "Selecciona una talla",
  selectColorFirst: "Selecciona un color",

  deliveryTitle: "Detalles de envío",
  estimatedDelivery: "Entrega estimada en 1-2 días hábiles",
  returnPolicy: "Devoluciones fáciles dentro de 3 días",

  productInfoTitle: "Información del producto",
  skuLabel: "SKU",
  stockLabel: "Stock",
  inStock: "En stock",
  lowStock: (qty: number) => `Solo quedan ${qty} unidades`,
  outOfStockLabel: "Sin stock",

  safeCheckoutTitle: "Pago seguro garantizado",

  tabDescription: "Descripción",
  tabAdditionalInfo: "Información adicional",
  tabReviews: "Reseñas",
  noDescription: "Este producto no tiene descripción disponible.",
  noReviews: "Aún no hay reseñas para este producto.",

  reviews: "reseñas",
  sale: "Oferta",
  featured: "Destacado",
} as const;
