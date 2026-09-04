import { redirect } from "next/navigation";

interface BuscarRedirectProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BuscarRedirect({ searchParams }: BuscarRedirectProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
      continue;
    }

    if (value) {
      query.set(key, value);
    }
  }

  const suffix = query.toString();
  redirect(suffix ? `/search?${suffix}` : "/search");
}
