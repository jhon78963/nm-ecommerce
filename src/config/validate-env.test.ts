import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { validateEnv } from "@/config/validate-env";

describe("validateEnv", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("throws when STORE_WAREHOUSE_ID is missing", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("STORE_WAREHOUSE_ID", "");

    expect(() => validateEnv()).toThrow(/STORE_WAREHOUSE_ID/);
  });

  it("does not validate production-only vars in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("STORE_WAREHOUSE_ID", "warehouse-1");

    expect(() => validateEnv()).not.toThrow();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("throws in production when required vars are missing", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("STORE_WAREHOUSE_ID", "warehouse-1");
    vi.stubEnv("API_BASE_URL", "");

    expect(() => validateEnv()).toThrow(/API_BASE_URL/);
  });

  it("passes when all required vars are set in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("STORE_WAREHOUSE_ID", "warehouse-1");
    vi.stubEnv("API_BASE_URL", "https://api.example.com/api/v1");
    vi.stubEnv("ECOMMERCE_SERVICE_URL", "http://ecommerce:3012");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://shop.example.com");

    expect(() => validateEnv()).not.toThrow();
  });
});
