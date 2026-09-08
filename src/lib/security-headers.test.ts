import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildSecurityHeaders } from "@/lib/security-headers";

describe("buildSecurityHeaders", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("includes baseline security headers", () => {
    const headers = buildSecurityHeaders();

    expect(headers["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("uses report-only CSP outside production", () => {
    vi.stubEnv("NODE_ENV", "development");

    const headers = buildSecurityHeaders();

    expect(headers["Content-Security-Policy-Report-Only"]).toContain("default-src 'self'");
    expect(headers["Content-Security-Policy"]).toBeUndefined();
  });

  it("enforces CSP in production by default", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://novedadesmaritex.net.pe");

    const headers = buildSecurityHeaders();

    expect(headers["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(headers["Content-Security-Policy"]).toContain("upgrade-insecure-requests");
  });

  it("relaxes frame-src on checkout routes for 3DS", () => {
    vi.stubEnv("NODE_ENV", "production");

    const checkoutHeaders = buildSecurityHeaders({ allowPaymentFrames: true });
    const defaultHeaders = buildSecurityHeaders();

    const checkoutFrameSrc =
      checkoutHeaders["Content-Security-Policy"]?.split(";").find((part) => part.trim().startsWith("frame-src")) ??
      "";
    const defaultFrameSrc =
      defaultHeaders["Content-Security-Policy"]?.split(";").find((part) => part.trim().startsWith("frame-src")) ??
      "";

    expect(checkoutFrameSrc.split(" ")).toContain("https:");
    expect(defaultFrameSrc.split(" ")).not.toContain("https:");
  });
});
