import type { Metadata } from "next";

import { AccountNotifications } from "@/features/account/components/AccountNotifications";
import { AccountShell } from "@/features/account/components/AccountShell";

export const metadata: Metadata = {
  title: "Notificaciones",
};

export default function AccountNotificationsPage() {
  return (
    <AccountShell title="Notificaciones">
      <AccountNotifications />
    </AccountShell>
  );
}
