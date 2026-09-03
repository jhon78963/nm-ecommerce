import type { Metadata } from "next";

import { AccountRefunds } from "@/features/account/components/AccountRefunds";
import { AccountShell } from "@/features/account/components/AccountShell";

export const metadata: Metadata = {
  title: "Reembolsos",
};

export default function AccountRefundsPage() {
  return (
    <AccountShell title="Reembolsos">
      <AccountRefunds />
    </AccountShell>
  );
}
