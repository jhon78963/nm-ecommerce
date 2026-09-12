import { afterEach, describe, expect, it, vi } from "vitest";

import { buildAbsolutePublicUrl } from "@/lib/public-site-url";

describe("buildAbsolutePublicUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses NEXT_PUBLIC_APP_URL on the server", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://novedadesmaritex.net.pe");

    expect(buildAbsolutePublicUrl("/producto/bermuda-urbana-3785b236")).toBe(
      "https://novedadesmaritex.net.pe/producto/bermuda-urbana-3785b236",
    );
  });
});
