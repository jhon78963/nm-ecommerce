const STORAGE_FILES_MARKER = "/storage/files/";

/**
 * Rewrites storage-service URLs to a same-origin proxy path so Next.js Image
 * can load them without private-IP restrictions in development.
 */
export function resolveStoreMediaUrl(url: string | null | undefined): string {
  if (!url?.trim()) {
    return "";
  }

  const value = url.trim();

  if (value.startsWith("/store-media/")) {
    return value;
  }

  const markerIndex = value.indexOf(STORAGE_FILES_MARKER);
  if (markerIndex >= 0) {
    const storagePath = value
      .slice(markerIndex + STORAGE_FILES_MARKER.length)
      .replace(/^\/+/, "");
    return `/store-media/${storagePath}`;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return value;
}

export function resolveStoreMediaUrls(urls: string[]): string[] {
  return urls
    .map((url) => resolveStoreMediaUrl(url))
    .filter((url) => url.length > 0);
}
