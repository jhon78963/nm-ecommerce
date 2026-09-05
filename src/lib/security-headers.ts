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

  // reCAPTCHA v3
  origins.add("https://www.google.com");
  origins.add("https://www.gstatic.com");

  return [...origins];
}

function buildContentSecurityPolicy(): string {
  const connectSrc = getBrowserConnectOrigins();
  const isProduction = process.env.NODE_ENV === "production";

  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(" ")}`,
    "frame-src https://www.google.com https://recaptcha.google.com",
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

export function buildSecurityHeaders(): Record<string, string> {
  const csp = buildContentSecurityPolicy();
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
