import type { Metadata } from "next";

import { AccountOrders } from "@/features/account/components/AccountOrders";
import { AccountShell } from "@/features/account/components/AccountShell";

export const metadata: Metadata = {
  title: "Mis pedidos",
  description: "Consulta el historial de tus pedidos en Novedades Maritex.",
};

export default function AccountOrdersPage() {
  return (
    <AccountShell title="Mis pedidos">
      <AccountOrders />
    </AccountShell>
  );
}
