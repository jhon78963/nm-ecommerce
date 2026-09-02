import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ProductDetailPage } from "@/features/product/components/ProductDetailPage";
import { getProductBySlug } from "@/features/product/services/catalog.service";
import { getProductHref } from "@/lib/routes";
import { resolveProductSlug } from "@/utils/product-slug";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const canonicalSlug = resolveProductSlug(product);

  if (slug !== canonicalSlug) {
    permanentRedirect(getProductHref(canonicalSlug));
  }

  return <ProductDetailPage product={product} />;
}
