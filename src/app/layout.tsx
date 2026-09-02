import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { CartProvider } from "@/features/cart/context/CartProvider";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Novedades Maritex",
  description: "Tienda en línea de Novedades Maritex",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
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
