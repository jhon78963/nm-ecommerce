import type { Metadata } from "next";

import { AccountAddresses } from "@/features/account/components/AccountAddresses";
import { AccountShell } from "@/features/account/components/AccountShell";

export const metadata: Metadata = {
  title: "Mis direcciones",
};

export default function AccountAddressesPage() {
  return (
    <AccountShell title="Mis direcciones">
      <AccountAddresses />
    </AccountShell>
  );
}
