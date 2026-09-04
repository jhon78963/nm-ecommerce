import type { NextConfig } from "next";

function getApiBaseUrl(): string {
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:3000/api/v1"
  ).replace(/\/$/, "");
}

function buildStorageImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
  const candidates = [
    process.env.API_BASE_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    "http://localhost:3000/api/v1",
    "https://api.novedadesmaritex.net.pe/api/v1",
  ].filter((value): value is string => Boolean(value?.trim()));

  for (const baseUrl of candidates) {
    try {
      const url = new URL(baseUrl);
      const protocol = url.protocol.replace(":", "") as "http" | "https";

      patterns.push({
        protocol,
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/api/v1/storage/files/**",
      });
    } catch {
      // Ignore invalid URLs in env.
    }
  }

  return patterns.filter(
    (pattern, index, list) =>
      list.findIndex(
        (entry) =>
          entry.protocol === pattern.protocol &&
          entry.hostname === pattern.hostname &&
          entry.port === pattern.port &&
          entry.pathname === pattern.pathname,
      ) === index,
  );
}

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: buildStorageImagePatterns(),
  },
  async rewrites() {
    const apiBase = getApiBaseUrl();

    return [
      {
        source: "/store-media/:path*",
        destination: `${apiBase}/storage/files/:path*`,
      },
    ];
  },
};

export default nextConfig;
