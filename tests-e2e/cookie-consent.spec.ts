import { expect, test } from "@playwright/test";

import { COOKIE_CONSENT_STORAGE_KEY } from "../src/features/cookies/constants/cookie-consent";

test.describe("Cookie consent banner", () => {
  test("shows on first visit and persists rejection", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const banner = page.getByRole("dialog", { name: "Preferencias de cookies" });
    await expect(banner).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Usamos cookies")).toBeVisible();
    await expect(banner.getByRole("link", { name: "Política de Cookies" })).toHaveAttribute(
      "href",
      "/politica-de-cookies",
    );

    await page.getByRole("button", { name: "Solo necesarias" }).click();
    await expect(banner).toHaveCount(0);

    const stored = await page.evaluate(
      (key) => localStorage.getItem(key),
      COOKIE_CONSENT_STORAGE_KEY,
    );
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!) as { analytics: boolean; marketing: boolean };
    expect(parsed.analytics).toBe(false);
    expect(parsed.marketing).toBe(false);
  });

  test("does not inject analytics scripts without consent", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Solo necesarias" }).click();

    await expect(page.locator('script[id="nm-gtm-loader"]')).toHaveCount(0);
    await expect(page.locator('script[id="nm-cf-beacon"]')).toHaveCount(0);
  });
});
