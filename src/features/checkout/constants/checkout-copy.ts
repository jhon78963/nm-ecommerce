export const CHECKOUT_COPY = {
  pageTitle: "Finalizar compra",
  pageDescription: "Completa tus datos para procesar el pedido.",
  breadcrumbHome: "Inicio",
  breadcrumbCurrent: "Checkout",

  stepBillingTitle: "Datos de facturación",
  stepBillingSubtitle: "Nombre, dirección y contacto",
  stepShippingTitle: "Dirección de envío",
  stepShippingSubtitle: "Dirección donde recibirás tu pedido",
  stepNotesTitle: "Información adicional",
  stepNotesSubtitle: "Notas o instrucciones especiales",

  firstName: "Nombre",
  lastName: "Apellidos",
  email: "Correo electrónico",
  phone: "Teléfono",
  country: "País",
  address: "Dirección",
  address2: "Referencia adicional (opcional)",
  city: "Ciudad",
  state: "Departamento",
  postcode: "Código postal",
  orderNotes: "Notas del pedido (opcional)",
  sameAsBilling: "Usar los mismos datos de facturación",
  accountPrefillNotice:
    "Completamos tus datos con la información de tu cuenta. Puedes editarlos antes de pagar.",

  selectDepartment: "Selecciona un departamento",
  requiredField: "Este campo es obligatorio",
  invalidEmail: "Ingresa un correo válido",
  invalidCartVariant:
    "Uno o más productos del carrito no tienen talla válida. Elimínalos y vuelve a agregarlos desde la ficha del producto.",

  summaryTitle: "Resumen del pedido",
  summarySubtitle: "Verifica tus productos antes de finalizar.",
  billingSummary: "Resumen de pago",
  subtotal: "Subtotal",
  shipping: "Envío",
  shippingZoneHint:
    "Las opciones de envío se calculan según el código postal y departamento de tu dirección de entrega.",
  shippingZoneTrujillo: "Zona Trujillo (código postal 130xx)",
  shippingZoneLaLibertad: "Provincias de La Libertad fuera de Trujillo",
  shippingZoneNational: "Envío a nivel nacional",
  couponDiscount: "Descuento cupón",
  total: "Total",
  taxIncluded: "Los precios incluyen IGV (18%)",
  placeOrder: "Realizar el pedido",
  processing: "Procesando...",

  couponLabel: "Código promocional",
  couponPlaceholder: "Ingresa tu código aquí...",
  applyCoupon: "Aplicar",
  removeCoupon: "Quitar",
  couponApplied: "Cupón aplicado",
  couponInvalid: "Cupón no válido",
  couponRequiresAccount:
    "Para usar cupones necesitas una cuenta. Inicia sesión o regístrate; tu carrito y los datos del checkout se mantendrán.",
  couponAccountHint: "Inicia sesión o crea una cuenta para aplicar cupones.",

  culqiInfo: "Acepta tarjetas de débito/crédito y Yape (código de 6 dígitos desde tu app).",
  privacyNotice:
    "Tus datos personales se utilizarán para procesar tu pedido, respaldar tu experiencia en este sitio web y para otros fines descritos en nuestra",
  privacyLink: "política de privacidad",

  emptyCartTitle: "Tu carrito está vacío",
  emptyCartDescription: "Agrega productos antes de finalizar la compra.",
  continueShopping: "Seguir comprando",

  bacsInstructions:
    "Al confirmar tu pedido verás el QR de Yape, el monto exacto y un botón para enviar tu comprobante por WhatsApp. Tu pedido se preparará cuando confirmemos el pago.",
  bacsPaymentIntro:
    "Completa tu pago con Yape, Plin o transferencia y envíanos el comprobante por WhatsApp.",
  bacsPaymentAmountLabel: "Monto a pagar",
  bacsPaymentReferenceLabel: "Referencia (número de pedido)",
  bacsPaymentQrAlt: "Código QR de Yape para pagar a Novedades Maritex",
  bacsPaymentQrCaption: "Escanea con Yape y paga el monto exacto indicado arriba.",
  bacsPaymentQrFallback:
    "Si no ves el QR, escanea el número de Yape indicado abajo o escríbenos por WhatsApp.",
  bacsPaymentYapeNumberLabel: "Número Yape",
  bacsPaymentCopy: "Copiar",
  bacsPaymentCopied: "Copiado",
  bacsPaymentSteps: [
    "Paga el monto exacto con Yape, Plin o transferencia bancaria.",
    "Toma captura del comprobante.",
    "Envíala por WhatsApp indicando tu número de pedido.",
  ],
  bacsPaymentWhatsAppButton: "Enviar comprobante por WhatsApp",
  bacsPaymentPendingNote:
    "Tu pago aparece como pendiente hasta que lo confirmemos. Te avisaremos cuando esté validado.",

  trackingPageTitle: "Seguimiento de pedido",
  trackingPageDescription:
    "Ingresa tu número de pedido y correo o teléfono para ver el estado.",
  orderNumber: "Número de pedido",
  emailOrPhone: "Correo o teléfono",
  track: "Rastrear pedido",

  orderDetailsTitle: "Detalle del pedido",
  orderNotFound: "No se encontró el pedido",
  orderNotFoundDescription:
    "Verifica el número de pedido y el correo o teléfono e intenta de nuevo.",
  consumerDetails: "Datos del cliente",
  billingAddress: "Dirección de facturación",
  shippingAddress: "Dirección de envío",
  paymentMode: "Método de pago",
  paymentStatus: "Estado del pago",
  summary: "Resumen",
  image: "Imagen",
  product: "Producto",
  price: "Precio",
  quantity: "Cantidad",
  lineTotal: "Subtotal",
  back: "Volver",

  confirmationTitle: "¡Pedido recibido!",
  confirmationDescription:
    "Gracias por tu compra. Hemos registrado tu pedido y te contactaremos si necesitamos más información.",
  confirmationOrderNumber: "Número de pedido",
  confirmationNextSteps: "Próximos pasos",
  confirmationBacs:
    "Sigue las instrucciones de pago a continuación. Envía tu comprobante por WhatsApp para confirmar tu pedido.",
  confirmationPaymentProcessing: "Estamos confirmando tu pago. Esta página se actualizará automáticamente.",
  confirmationPaymentFailed:
    "No pudimos confirmar el pago. Si el cargo se realizó en tu banco, contáctanos con tu número de pedido.",
  viewOrder: "Ver detalle del pedido",
  trackAnother: "Rastrear otro pedido",
} as const;
