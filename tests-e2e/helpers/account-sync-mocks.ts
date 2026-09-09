import type { Page } from "@playwright/test";

import type { CartLineItem } from "../../src/features/cart/types/cart.types";
import type { WishlistStoredItem } from "../../src/features/wishlist/types/wishlist.types";

let serverCart: CartLineItem[] = [];
let serverWishlist: WishlistStoredItem[] = [];
let authenticated = false;

export function resetAccountSyncMocks(): void {
  serverCart = [];
  serverWishlist = [];
  authenticated = false;
}

export function seedServerCart(items: CartLineItem[]): void {
  serverCart = structuredClone(items);
}

export function seedServerWishlist(items: WishlistStoredItem[]): void {
  serverWishlist = structuredClone(items);
}

export async function setupAccountSyncMocks(
  page: Page,
  options: { authenticated?: boolean } = {},
): Promise<void> {
  if (process.env.E2E_USE_REAL_API === "true") {
    return;
  }

  resetAccountSyncMocks();
  authenticated = options.authenticated ?? false;

  await page.route("**/api/customer-auth/me", async (route) => {
    if (authenticated) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "cust-e2e-sync",
          email: "sync-e2e@test.com",
          name: "Cliente Sync E2E",
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
    const method = route.request().method();

    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: serverCart }),
      });
      return;
    }

    if (method === "PUT") {
      const body = route.request().postDataJSON() as { items?: CartLineItem[] };
      serverCart = structuredClone(body.items ?? []);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: serverCart }),
      });
      return;
    }

    if (method === "DELETE") {
      serverCart = [];
      await route.fulfill({ status: 204, body: "" });
      return;
    }

    await route.fallback();
  });

  await page.route("**/api/account/wishlist**", async (route) => {
    const method = route.request().method();

    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: serverWishlist }),
      });
      return;
    }

    if (method === "PUT") {
      const body = route.request().postDataJSON() as { items?: WishlistStoredItem[] };
      serverWishlist = structuredClone(body.items ?? []);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: serverWishlist }),
      });
      return;
    }

    if (method === "DELETE") {
      serverWishlist = [];
      await route.fulfill({ status: 204, body: "" });
      return;
    }

    await route.fallback();
  });
}

export function getServerCartSnapshot(): CartLineItem[] {
  return structuredClone(serverCart);
}

export function getServerWishlistSnapshot(): WishlistStoredItem[] {
  return structuredClone(serverWishlist);
}
