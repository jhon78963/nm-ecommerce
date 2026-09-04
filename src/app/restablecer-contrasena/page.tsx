import type { Metadata } from "next";

import { ResetPasswordPage } from "@/features/auth/components/ResetPasswordPage";

export const metadata: Metadata = {
  title: "Restablecer contraseña",
  description: "Establece una nueva contraseña para tu cuenta en Novedades Maritex.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ResetPasswordPage />;
}
