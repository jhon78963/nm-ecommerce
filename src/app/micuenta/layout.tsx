import type { Metadata } from "next";

import { buildPrivatePageMetadata } from "@/features/seo/constants/site-meta";

export const metadata: Metadata = buildPrivatePageMetadata(
  "Mi cuenta",
  "Área privada de clientes de Novedades Maritex.",
);

export default function AccountLayout({ children }: LayoutProps<"/micuenta">) {
  return children;
}
