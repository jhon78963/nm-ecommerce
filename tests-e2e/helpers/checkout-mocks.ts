import type { Page } from "@playwright/test";

import { E2E_COUPON_CODE, E2E_EMAIL } from "./checkout-fixtures";

interface MockOrderItem {
  id: string;
  productId: string;
  productSizeId: string;
  colorId: string | null;
  name: string;
  variation?: string | null;
  imageUrl?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface MockApiOrder {
  id: string;
  orderNumber: string;
  status: "pending" | "processing";
  statusLabel: string;
  paymentStatus: "pending" | "paid";
  paymentStatusLabel: string;
  createdAt: string;
  email: string;
  billing: Record<string, string>;
  shipping: Record<string, string>;
  orderNotes?: string | null;
  shippingMethodId: string;
  shippingMethodTitle: string;
  shippingTotal: number;
  paymentMethodId: string;
  paymentMethodTitle: string;
  subtotal: number;
  couponCode?: string | null;
  couponDiscount: number;
  total: number;
  items: MockOrderItem[];
}

const orders = new Map<string, MockApiOrder>();
let orderCounter = 0;

function orderKey(orderNumber: string, contact: string): string {
  return `${orderNumber.trim().replace(/^#+/, "").toUpperCase()}::${contact.trim().toLowerCase()}`;
}

function cloneOrder(order: MockApiOrder): MockApiOrder {
  return structuredClone(order);
}

function findOrder(orderNumber: string, contact: string): MockApiOrder | undefined {
  const normalizedNumber = orderNumber.trim().replace(/^#+/, "").toUpperCase();
  const normalizedContact = contact.trim().toLowerCase();

  for (const [key, order] of orders.entries()) {
    const [storedNumber, storedContact] = key.split("::");
    if (storedNumber === normalizedNumber && storedContact === normalizedContact) {
      return order;
    }

    if (storedNumber === normalizedNumber && order.email.toLowerCase() === normalizedContact) {
      return order;
    }
  }

  return undefined;
}

function buildOrderFromPayload(payload: Record<string, unknown>): MockApiOrder {
  orderCounter += 1;
  const email = String(payload.email ?? E2E_EMAIL);
  const paymentMethodId = String(payload.paymentMethodId ?? "bacs");
  const couponCode = payload.couponCode ? String(payload.couponCode) : null;
  const items = Array.isArray(payload.items) ? payload.items : [];
  const subtotal = items.reduce((sum, item) => {
    const record = item as { unitPrice?: number; quantity?: number };
    return sum + Number(record.unitPrice ?? 0) * Number(record.quantity ?? 0);
  }, 0);
  const shippingTotal = paymentMethodId === "bacs" ? 8 : 8;
  const couponDiscount = couponCode ? Math.min(subtotal * 0.1, 10) : 0;
  const total = Math.max(subtotal + shippingTotal - couponDiscount, 0);
  const orderNumber = `NM-E2E-${String(orderCounter).padStart(4, "0")}`;

  const mappedItems: MockOrderItem[] = items.map((item, index) => {
    const record = item as {
      productId?: string;
      productSizeId?: string;
      colorId?: string;
      name?: string;
      variation?: string;
      imageUrl?: string;
      quantity?: number;
      unitPrice?: number;
    };

    const quantity = Number(record.quantity ?? 1);
    const unitPrice = Number(record.unitPrice ?? 0);

    return {
      id: `item-${index + 1}`,
      productId: String(record.productId ?? ""),
      productSizeId: String(record.productSizeId ?? ""),
      colorId: record.colorId ?? null,
      name: String(record.name ?? "Producto E2E"),
      variation: record.variation ?? null,
      imageUrl: record.imageUrl ?? null,
      quantity,
      unitPrice,
      subtotal: quantity * unitPrice,
    };
  });

  const billing = (payload.billing ?? {}) as Record<string, string>;
  const shipping = (payload.shipping ?? billing) as Record<string, string>;

  const order: MockApiOrder = {
    id: `order-${orderCounter}`,
    orderNumber,
    status: "pending",
    statusLabel: "Pendiente",
    paymentStatus: paymentMethodId === "culqi" ? "pending" : "pending",
    paymentStatusLabel: "Pendiente de pago",
    createdAt: new Date().toISOString(),
    email,
    billing,
    shipping,
    orderNotes: payload.orderNotes ? String(payload.orderNotes) : null,
    shippingMethodId: String(payload.shippingMethodId ?? "delivery-trujillo"),
    shippingMethodTitle: "Delivery local Trujillo (motorizado)",
    shippingTotal,
    paymentMethodId,
    paymentMethodTitle: paymentMethodId === "culqi" ? "Tarjetas, Yape y más (Culqi)" : "Transferencia / Yape / Plin",
    subtotal,
    couponCode,
    couponDiscount,
    total,
    items: mappedItems,
  };

  orders.set(orderKey(orderNumber, email), order);
  return order;
}

export function resetCheckoutMocks(): void {
  orders.clear();
  orderCounter = 0;
}

export function seedTrackedOrder(orderNumber: string, email = E2E_EMAIL): MockApiOrder {
  orderCounter += 1;

  const order: MockApiOrder = {
    id: `order-track-${orderCounter}`,
    orderNumber,
    status: "pending",
    statusLabel: "Pendiente",
    paymentStatus: "pending",
    paymentStatusLabel: "Pendiente de pago",
    createdAt: new Date().toISOString(),
    email,
    billing: {
      firstName: "E2E",
      lastName: "Cliente",
      country: "PE",
      address1: "Av. Test 123",
      address2: "",
      city: "Trujillo",
      state: "La Libertad",
      postcode: "13001",
      phone: "999888777",
    },
    shipping: {
      firstName: "E2E",
      lastName: "Cliente",
      country: "PE",
      address1: "Av. Test 123",
      address2: "",
      city: "Trujillo",
      state: "La Libertad",
      postcode: "13001",
      phone: "999888777",
    },
    shippingMethodId: "delivery-trujillo",
    shippingMethodTitle: "Delivery local Trujillo (motorizado)",
    shippingTotal: 8,
    paymentMethodId: "bacs",
    paymentMethodTitle: "Transferencia / Yape / Plin",
    subtotal: 49.9,
    couponDiscount: 0,
    total: 57.9,
    items: [
      {
        id: "item-1",
        productId: "11111111-1111-4111-8111-111111111111",
        productSizeId: "22222222-2222-4222-8222-222222222222",
        colorId: null,
        name: "Producto E2E",
        quantity: 1,
        unitPrice: 49.9,
        subtotal: 49.9,
      },
    ],
  };

  orders.set(orderKey(orderNumber, email), order);
  return order;
}

export interface CheckoutMockOptions {
  authenticated?: boolean;
}

export async function setupCheckoutApiMocks(
  page: Page,
  options: CheckoutMockOptions = {},
): Promise<void> {
  if (process.env.E2E_USE_REAL_API === "true") {
    return;
  }

  resetCheckoutMocks();

  await page.route("**/api/customer-auth/me", async (route) => {
    if (options.authenticated) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "cust-e2e-001",
          email: E2E_EMAIL,
          name: "E2E Cliente",
        }),
      });
      return;
    }

    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "No autenticado" }),
    });
  });

  await page.route("**/api/account/cart**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ items: [] }),
    });
  });

  await page.route("**/api/checkout/coupons/validate", async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }

    const body = route.request().postDataJSON() as { code?: string; subtotal?: number };
    const code = body.code?.trim().toUpperCase() ?? "";

    if (code !== E2E_COUPON_CODE) {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ message: "Cupón no válido" }),
      });
      return;
    }

    const subtotal = Number(body.subtotal ?? 0);
    const discountAmount = Math.min(subtotal * 0.1, 10);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        code: E2E_COUPON_CODE,
        discountType: "percentage",
        discountValue: 10,
        discountAmount,
        description: "Cupón E2E",
      }),
    });
  });

  await page.route("**/api/checkout/order", async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }

    const payload = route.request().postDataJSON() as Record<string, unknown>;
    const order = buildOrderFromPayload(payload);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(order),
    });
  });

  await page.route("**/api/checkout/track", async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }

    const body = route.request().postDataJSON() as { orderNumber?: string; contact?: string };
    const order = findOrder(String(body.orderNumber ?? ""), String(body.contact ?? ""));

    if (!order) {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "No encontramos un pedido con esos datos." }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(cloneOrder(order)),
    });
  });

  await page.route(/\/api\/checkout\/order\/[^/?]+$/, async (route) => {
    if (route.request().method() !== "GET") {
      await route.fallback();
      return;
    }

    const url = new URL(route.request().url());
    const orderNumber = decodeURIComponent(url.pathname.split("/").pop() ?? "");
    const email = url.searchParams.get("email") ?? "";
    const order = findOrder(orderNumber, email);

    if (!order) {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Pedido no encontrado." }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(cloneOrder(order)),
    });
  });

  await page.route("**/api/checkout/payments/culqi/prepare", async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        culqiOrderId: "ord_test_e2e",
        amountInCentimos: 5790,
        rsaId: "rsa_test_e2e",
        rsaPublicKey:
          "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA\n-----END PUBLIC KEY-----",
      }),
    });
  });

  await page.route("**/api/checkout/payments/culqi/charge", async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }

    const body = route.request().postDataJSON() as { orderNumber?: string; email?: string };
    const orderNumber = String(body.orderNumber ?? "").trim();

    for (const order of orders.values()) {
      if (order.orderNumber === orderNumber) {
        order.paymentStatus = "paid";
        order.paymentStatusLabel = "Pagado";
        order.status = "processing";
        order.statusLabel = "En preparación";
        orders.set(orderKey(order.orderNumber, order.email), order);
        break;
      }
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        orderNumber,
        paymentStatus: "paid",
        culqiChargeId: "chr_test_e2e",
      }),
    });
  });
}

export function getLatestOrder(): MockApiOrder | undefined {
  return [...orders.values()].at(-1);
}
