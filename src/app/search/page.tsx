import { permanentRedirect } from "next/navigation";

import { buildSearchPath } from "@/lib/routes";

interface SearchRedirectProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Compatibilidad: redirige la ruta legacy `/search` a la canónica `/buscar`. */
export default async function SearchRedirect({ searchParams }: SearchRedirectProps) {
  const params = await searchParams;
  permanentRedirect(buildSearchPath(params));
}
