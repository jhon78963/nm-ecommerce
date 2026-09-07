function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function getPublicAppOrigin(): string | undefined {
  const appUrl = readEnv("NEXT_PUBLIC_APP_URL");
  if (!appUrl) {
    return undefined;
  }

  try {
    return new URL(appUrl).origin;
  } catch {
    return undefined;
  }
}

/** Orígenes que el navegador puede usar (no URLs internas Docker como gateway:3000). */
function getBrowserConnectOrigins(): string[] {
  const origins = new Set<string>(["'self'"]);

  const appOrigin = getPublicAppOrigin();
  if (appOrigin) {
    origins.add(appOrigin);
  }

  const publicApiBase = readEnv("NEXT_PUBLIC_API_BASE_URL");
  if (publicApiBase) {
    try {
      origins.add(new URL(publicApiBase).origin);
    } catch {
      // Ignore invalid public API URL.
    }
  }

  origins.add("https://www.google.com");
  origins.add("https://www.gstatic.com");
  origins.add("https://api.culqi.com");
  origins.add("https://checkout.culqi.com");
  origins.add("https://3ds.culqi.com");
  origins.add("https://*.culqi.com");

  return [...origins];
}

const CULQI_SCRIPT_SRC = [
  "https://checkout.culqi.com",
  "https://js.culqi.com",
  "https://3ds.culqi.com",
  "https://static.culqi.com",
];

const CULQI_FRAME_SRC = [
  "https://checkout.culqi.com",
  "https://3ds.culqi.com",
  "https://js.culqi.com",
  "https://static.culqi.com",
  "https://*.culqi.com",
  "https://*.cardinalcommerce.com",
];

interface BuildSecurityHeadersOptions {
  /** Checkout/pago: permite iframes 3DS de bancos (URLs dinámicas). */
  allowPaymentFrames?: boolean;
}

function buildContentSecurityPolicy(options: BuildSecurityHeadersOptions = {}): string {
  const connectSrc = getBrowserConnectOrigins();
  const isProduction = process.env.NODE_ENV === "production";

  const frameSrc = [
    "https://www.google.com",
    "https://recaptcha.google.com",
    ...CULQI_FRAME_SRC,
    ...(options.allowPaymentFrames ? ["https:"] : []),
  ];

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com ${CULQI_SCRIPT_SRC.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(" ")}`,
    `frame-src ${frameSrc.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ];

  if (isProduction) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

export function buildSecurityHeaders(
  options: BuildSecurityHeadersOptions = {},
): Record<string, string> {
  const csp = buildContentSecurityPolicy(options);
  const enforceCsp =
    process.env.CSP_ENFORCE !== "false" && process.env.NODE_ENV === "production";

  return {
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    ...(enforceCsp
      ? { "Content-Security-Policy": csp }
      : { "Content-Security-Policy-Report-Only": csp }),
  };
}
