import { expect, test } from "@playwright/test";

import type { CartLineItem } from "../src/features/cart/types/cart.types";
import type { WishlistStoredItem } from "../src/features/wishlist/types/wishlist.types";
import {
  getServerCartSnapshot,
  getServerWishlistSnapshot,
  seedServerCart,
  seedServerWishlist,
  setupAccountSyncMocks,
} from "./helpers/account-sync-mocks";

const COOKIE_CONSENT = {
  version: 1,
  necessary: true,
  analytics: false,
  marketing: false,
  decidedAt: "2026-09-09T00:00:00.000Z",
};

const SERVER_CART_ITEM: CartLineItem = {
  id: "server-line-1",
  productId: "33333333-3333-4333-8333-333333333333",
  productSizeId: "44444444-4444-4444-8444-444444444444",
  name: "Polo servidor",
  quantity: 2,
  price: 39.9,
};

const LOCAL_CART_ITEM: CartLineItem = {
  id: "local-line-1",
  productId: "11111111-1111-4111-8111-111111111111",
  productSizeId: "22222222-2222-4222-8222-222222222222",
  name: "Polo local",
  quantity: 1,
  price: 49.9,
};

const SERVER_WISHLIST_ITEM: WishlistStoredItem = {
  productId: "55555555-5555-4555-8555-555555555555",
  name: "Vestido servidor",
  price: 89.9,
  addedAt: "2026-09-08T12:00:00.000Z",
};

const LOCAL_WISHLIST_ITEM: WishlistStoredItem = {
  productId: "66666666-6666-4666-8666-666666666666",
  name: "Blusa local",
  price: 59.9,
  addedAt: "2026-09-09T08:00:00.000Z",
};

async function prepareGuestStorage(
  page: import("@playwright/test").Page,
  options: {
    cart?: CartLineItem[];
    wishlist?: WishlistStoredItem[];
  } = {},
): Promise<void> {
  await page.addInitScript(
    ({ consentKey, consentValue, cartKey, wishlistKey, cart, wishlist }) => {
      localStorage.setItem(consentKey, consentValue);
      localStorage.setItem(cartKey, JSON.stringify(cart));
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    },
    {
      consentKey: "nm_cookie_consent",
      consentValue: JSON.stringify(COOKIE_CONSENT),
      cartKey: "nm-ecommerce-cart",
      wishlistKey: "nm_wishlist",
      cart: options.cart ?? [],
      wishlist: options.wishlist ?? [],
    },
  );
}

async function readStoredCart(page: import("@playwright/test").Page): Promise<CartLineItem[]> {
  return page.evaluate(() => {
    const raw = localStorage.getItem("nm-ecommerce-cart");
    return raw ? (JSON.parse(raw) as CartLineItem[]) : [];
  });
}

async function readStoredWishlist(page: import("@playwright/test").Page): Promise<WishlistStoredItem[]> {
  return page.evaluate(() => {
    const raw = localStorage.getItem("nm_wishlist");
    return raw ? (JSON.parse(raw) as WishlistStoredItem[]) : [];
  });
}

test.describe("Account sync — carrito y wishlist", () => {
  test("login recupera carrito del servidor en dispositivo nuevo", async ({ page }) => {
    await setupAccountSyncMocks(page, { authenticated: true });
    seedServerCart([SERVER_CART_ITEM]);
    await prepareGuestStorage(page);

    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect
      .poll(async () => {
        const items = await readStoredCart(page);
        return items.some((item) => item.productId === SERVER_CART_ITEM.productId);
      }, { timeout: 15_000 })
      .toBe(true);

    const cart = await readStoredCart(page);
    expect(cart).toHaveLength(1);
    expect(cart[0]?.name).toBe("Polo servidor");
    expect(cart[0]?.quantity).toBe(2);
    expect(getServerCartSnapshot()).toHaveLength(1);
  });

  test("login fusiona carrito local con carrito del servidor", async ({ page }) => {
    await setupAccountSyncMocks(page, { authenticated: true });
    seedServerCart([SERVER_CART_ITEM]);
    await prepareGuestStorage(page, { cart: [LOCAL_CART_ITEM] });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect
      .poll(async () => (await readStoredCart(page)).length, { timeout: 15_000 })
      .toBe(2);

    const cart = await readStoredCart(page);
    expect(cart.map((item) => item.productId).sort()).toEqual(
      [LOCAL_CART_ITEM.productId, SERVER_CART_ITEM.productId].sort(),
    );
    expect(getServerCartSnapshot()).toHaveLength(2);
  });

  test("login recupera wishlist del servidor en dispositivo nuevo", async ({ page }) => {
    await setupAccountSyncMocks(page, { authenticated: true });
    seedServerWishlist([SERVER_WISHLIST_ITEM]);
    await prepareGuestStorage(page);

    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect
      .poll(async () => {
        const items = await readStoredWishlist(page);
        return items.some((item) => item.productId === SERVER_WISHLIST_ITEM.productId);
      }, { timeout: 15_000 })
      .toBe(true);

    const wishlist = await readStoredWishlist(page);
    expect(wishlist).toHaveLength(1);
    expect(wishlist[0]?.name).toBe("Vestido servidor");
    expect(getServerWishlistSnapshot()).toHaveLength(1);
  });

  test("login fusiona wishlist local con favoritos del servidor", async ({ page }) => {
    await setupAccountSyncMocks(page, { authenticated: true });
    seedServerWishlist([SERVER_WISHLIST_ITEM]);
    await prepareGuestStorage(page, { wishlist: [LOCAL_WISHLIST_ITEM] });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect
      .poll(async () => (await readStoredWishlist(page)).length, { timeout: 15_000 })
      .toBe(2);

    const wishlist = await readStoredWishlist(page);
    expect(wishlist.map((item) => item.productId).sort()).toEqual(
      [LOCAL_WISHLIST_ITEM.productId, SERVER_WISHLIST_ITEM.productId].sort(),
    );
    expect(getServerWishlistSnapshot()).toHaveLength(2);
  });
});
