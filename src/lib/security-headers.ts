function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function getApiOrigin(): string | undefined {
  const apiBase =
    readEnv("API_BASE_URL") ??
    readEnv("NEXT_PUBLIC_API_BASE_URL") ??
    "http://localhost:3000/api/v1";

  try {
    return new URL(apiBase).origin;
  } catch {
    return undefined;
  }
}

function buildContentSecurityPolicyReportOnly(): string {
  const apiOrigin = getApiOrigin();
  const connectSrc = ["'self'", "https://www.google.com", "https://www.gstatic.com"];

  if (apiOrigin) {
    connectSrc.push(apiOrigin);
  }

  return [
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
  ].join("; ");
}

export function buildSecurityHeaders(): Record<string, string> {
  return {
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy-Report-Only": buildContentSecurityPolicyReportOnly(),
  };
}
