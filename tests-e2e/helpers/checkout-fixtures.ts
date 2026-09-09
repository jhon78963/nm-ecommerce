import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import type { CartLineItem } from "../../src/features/cart/types/cart.types";

export const E2E_EMAIL = "e2e-checkout@test.com";
export const E2E_PHONE = "999888777";
export const E2E_COUPON_CODE = "PROMO10";

export const E2E_CART_ITEM: CartLineItem = {
  id: "line-e2e-1",
  productId: "11111111-1111-4111-8111-111111111111",
  productSizeId: "22222222-2222-4222-8222-222222222222",
  name: "Producto E2E",
  quantity: 1,
  price: 49.9,
};

const COOKIE_CONSENT = {
  version: 1,
  necessary: true,
  analytics: false,
  marketing: false,
  decidedAt: "2026-09-09T00:00:00.000Z",
};

export async function prepareStorefront(page: Page): Promise<void> {
  await page.addInitScript(({ cartKey, cartItem, consentKey, consentValue }) => {
    localStorage.setItem(cartKey, JSON.stringify([cartItem]));
    localStorage.setItem(consentKey, consentValue);
  }, {
    cartKey: "nm-ecommerce-cart",
    cartItem: E2E_CART_ITEM,
    consentKey: "nm_cookie_consent",
    consentValue: JSON.stringify(COOKIE_CONSENT),
  });
}

export async function fillCheckoutForm(page: Page, email = E2E_EMAIL): Promise<void> {
  await page.locator("#checkout-email").fill(email);
  await page.locator("#billing-firstName").fill("E2E");
  await page.locator("#billing-lastName").fill("Cliente");
  await page.locator("#billing-address1").fill("Av. Test 123");
  await page.locator("#billing-city").fill("Trujillo");
  await page.locator("#billing-state").selectOption("La Libertad");
  await page.locator("#billing-postcode").fill("13001");
  await page.locator("#billing-phone").fill(E2E_PHONE);
}

export async function gotoCheckout(page: Page): Promise<void> {
  await page.goto("/checkout", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#checkout-email")).toBeVisible({ timeout: 30_000 });
}

export async function submitCheckout(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Realizar el pedido" }).click();
}
