import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.E2E_PORT ?? "3015";
const HOST = process.env.E2E_HOST ?? "localhost";
const BASE_URL = process.env.E2E_BASE_URL ?? `http://${HOST}:${PORT}`;
const SKIP_WEB_SERVER = process.env.E2E_SKIP_WEBSERVER === "true";

const webServerEnv = {
  STORE_WAREHOUSE_ID: process.env.STORE_WAREHOUSE_ID ?? "e2e-warehouse",
  NEXT_PUBLIC_APP_URL: BASE_URL,
  ECOMMERCE_SERVICE_URL: process.env.ECOMMERCE_SERVICE_URL ?? "http://127.0.0.1:3012",
  API_BASE_URL: process.env.API_BASE_URL ?? "http://127.0.0.1:3000/api/v1",
  NEXT_PUBLIC_CULQI_PUBLIC_KEY: process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ?? "pk_test_e2e",
};

export default defineConfig({
  testDir: "./tests-e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: process.env.CI ? 90_000 : 60_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    navigationTimeout: process.env.CI ? 60_000 : 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: SKIP_WEB_SERVER
    ? undefined
    : {
        command: process.env.CI ? "npm run start" : "npm run dev",
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: process.env.CI ? 300_000 : 120_000,
        env: webServerEnv,
      },
});
