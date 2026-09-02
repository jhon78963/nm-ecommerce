import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { CartProvider } from "@/features/cart/context/CartProvider";
import { ExitTagline } from "@/features/seo/components/ExitTagline";
import { getDefaultDocumentTitle, SITE_META } from "@/features/seo/constants/site-meta";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: getDefaultDocumentTitle(),
  description: SITE_META.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <ExitTagline />
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
