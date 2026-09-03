import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ProductDetailPage } from "@/features/product/components/ProductDetailPage";
import { getProductBySlug } from "@/features/product/services/catalog.service";
import { getProductHref } from "@/lib/routes";
import { resolveProductSlug } from "@/utils/product-slug";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Novedades Maritex",
    };
  }

  return {
    title: `${product.name} | Novedades Maritex`,
    description: `Compra ${product.name} en Novedades Maritex.`,
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const canonicalSlug = resolveProductSlug(product);

  if (slug !== canonicalSlug) {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(rawSearchParams)) {
      if (typeof value === "string") {
        query.set(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((entry) => query.append(key, entry));
      }
    }

    const queryString = query.toString();
    permanentRedirect(
      getProductHref(canonicalSlug) + (queryString ? `?${queryString}` : ""),
    );
  }

  return <ProductDetailPage product={product} />;
}
