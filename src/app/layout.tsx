import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Suspense } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { CartProvider } from "@/features/cart/context/CartProvider";
import { QuickViewProvider } from "@/features/product/context/QuickViewProvider";
import { ExitTagline } from "@/features/seo/components/ExitTagline";
import { getDefaultDocumentTitle, SITE_META } from "@/features/seo/constants/site-meta";
import { WishlistProvider } from "@/features/wishlist/context/WishlistProvider";

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
    <html lang="es" className={`${montserrat.variable} h-full bg-white antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-[#222]">
        <ExitTagline />
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <QuickViewProvider>
                <Suspense fallback={<header className="h-20 w-full bg-white shadow-sm" aria-hidden />}>
                  <Header />
                </Suspense>
                <main className="flex flex-1 flex-col">{children}</main>
                <Suspense fallback={<footer className="h-40 w-full bg-[#f8f8f8]" aria-hidden />}>
                  <Footer />
                </Suspense>
              </QuickViewProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
