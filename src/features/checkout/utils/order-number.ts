/** Strips display prefixes (e.g. "#") before order lookup. */
export function normalizeOrderNumberForLookup(raw: string): string {
  return raw.trim().replace(/^#+/, "").toUpperCase();
}
