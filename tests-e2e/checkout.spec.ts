import { expect, test } from "@playwright/test";

import {
  E2E_COUPON_CODE,
  E2E_EMAIL,
  fillCheckoutForm,
  gotoCheckout,
  prepareStorefront,
  submitCheckout,
} from "./helpers/checkout-fixtures";
import { setupCheckoutApiMocks, seedTrackedOrder } from "./helpers/checkout-mocks";
import { installCulqiStub } from "./helpers/culqi-mocks";

test.describe("Checkout E2E", () => {
  test.beforeEach(async ({ page }) => {
    await setupCheckoutApiMocks(page);
    await prepareStorefront(page);
  });

  test("completes guest checkout with BACS and shows payment instructions", async ({ page }) => {
    await gotoCheckout(page);
    await fillCheckoutForm(page);
    await submitCheckout(page);

    await expect(page).toHaveURL(/\/pedido\/confirmacion/);
    await expect(page.getByRole("heading", { name: "¡Pedido recibido!" })).toBeVisible();
    await expect(page.locator(".bacs-payment")).toBeVisible();
    await expect(page.locator(".order-confirmation__number strong")).toContainText("NM-E2E-");
  });

  test("completes Culqi checkout with mocked token and charge", async ({ page }) => {
    await installCulqiStub(page);

    const prepareResponse = page.waitForResponse(
      (response) =>
        response.url().includes("/api/checkout/payments/culqi/prepare")
        && response.request().method() === "POST"
        && response.ok(),
    );

    await gotoCheckout(page);
    await fillCheckoutForm(page);
    await page.getByRole("radio", { name: "Tarjetas, Yape y más (Culqi)" }).click();
    await submitCheckout(page);

    await prepareResponse;
    await expect(page).toHaveURL(/\/pedido\/confirmacion/);
    await expect(page.getByRole("heading", { name: "¡Pedido recibido!" })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.locator(".bacs-payment")).toHaveCount(0);
    await expect(page.locator(".order-confirmation__number strong")).toContainText("NM-E2E-");
  });

  test("applies coupon for authenticated customer", async ({ page }) => {
    await setupCheckoutApiMocks(page, { authenticated: true });
    await prepareStorefront(page);

    await gotoCheckout(page);
    await expect(page.locator("#checkout-coupon")).toBeVisible();

    await page.locator("#checkout-coupon").fill(E2E_COUPON_CODE);
    await page.getByRole("button", { name: "Aplicar" }).click();

    await expect(page.locator(".coupon-success")).toHaveText("Cupón aplicado");
    await expect(page.getByText("Descuento cupón")).toBeVisible();
  });

  test("tracks guest order from seguimiento page", async ({ page }) => {
    const orderNumber = "NM-E2E-TRACK";
    seedTrackedOrder(orderNumber, E2E_EMAIL);

    await page.goto("/pedido/seguimiento");
    await page.locator("#order_number").fill(orderNumber);
    await page.locator("#email_or_phone").fill(E2E_EMAIL);
    await page.getByRole("button", { name: "Rastrear pedido" }).click();

    await expect(page).toHaveURL(/\/pedido\/detalle/);
    await expect(page.getByRole("heading", { name: /NM-E2E-TRACK/ })).toBeVisible();
  });
});
