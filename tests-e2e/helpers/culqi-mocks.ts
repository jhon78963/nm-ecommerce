import type { Page } from "@playwright/test";

export async function installCulqiStub(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.Culqi = {
      publicKey: "pk_test_e2e",
      settings: () => {},
      options: () => {},
      open: () => {
        window.Culqi!.token = { id: "tok_test_e2e_mock" };
        window.culqi?.();
      },
      close: () => {},
    };
  });
}
