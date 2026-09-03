import type { Metadata } from "next";

import { AccountDashboard } from "@/features/account/components/AccountDashboard";
import { AccountShell } from "@/features/account/components/AccountShell";

export const metadata: Metadata = {
  title: "Mi perfil",
  description: "Panel de tu cuenta en Novedades Maritex.",
};

export default function AccountDashboardPage() {
  return (
    <AccountShell title="Mi perfil">
      <AccountDashboard />
    </AccountShell>
  );
}
