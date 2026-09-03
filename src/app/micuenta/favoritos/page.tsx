import type { Metadata } from "next";

import { AccountShell } from "@/features/account/components/AccountShell";
import { WishlistPage } from "@/features/wishlist/components/WishlistPage";

export const metadata: Metadata = {
  title: "Mis favoritos",
  description: "Productos guardados en tu lista de favoritos.",
};

export default function AccountFavoritesPage() {
  return (
    <AccountShell title="Mis favoritos">
      <WishlistPage embedded />
    </AccountShell>
  );
}
