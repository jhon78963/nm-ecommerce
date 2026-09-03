import type { Metadata } from "next";

import { AccountOrderDetail } from "@/features/account/components/AccountOrderDetail";
import { AccountShell } from "@/features/account/components/AccountShell";

export const metadata: Metadata = {
  title: "Detalle del pedido",
};

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function AccountOrderDetailPage({ params }: PageProps) {
  const { orderNumber } = await params;

  return (
    <AccountShell title={`Pedido #${orderNumber}`}>
      <AccountOrderDetail orderNumber={orderNumber} />
    </AccountShell>
  );
}
