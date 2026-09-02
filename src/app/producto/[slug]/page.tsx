import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ProductDetailView } from "@/features/product/components/ProductDetailView";
import { getProductBySlug } from "@/features/product/services/catalog.service";
import { getProductHref } from "@/lib/routes";

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

  if (slug !== product.slug) {
    permanentRedirect(getProductHref(product.slug));
  }

  return <ProductDetailView product={product} />;
}
