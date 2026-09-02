import { MessageCircle } from "lucide-react";

import { TopBarCurrency } from "@/features/navigation/components/TopBarCurrency";
import { TopBarLanguage } from "@/features/navigation/components/TopBarLanguage";
import { DEFAULT_TOP_BAR } from "@/features/navigation/constants/top-bar";
import type { TopBarConfig } from "@/features/navigation/types/navigation.types";

interface HeaderTopBarProps extends TopBarConfig {}

export function HeaderTopBar({
  siteName = DEFAULT_TOP_BAR.siteName,
  supportNumber = DEFAULT_TOP_BAR.supportNumber,
}: HeaderTopBarProps) {
  return (
    <div className="bg-[#333333]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-2 px-4">
        <ul className="flex flex-wrap items-center py-2.5">
          <li className="hidden pr-6 text-sm text-[#d9d9d9] min-[1400px]:block">
            Bienvenido a {siteName}
          </li>
          <li className="flex items-center text-sm text-[#d9d9d9]">
            <MessageCircle className="mr-1.5 size-4 text-theme" aria-hidden />
            Llámanos: {supportNumber}
          </li>
        </ul>

        <ul className="flex items-center py-2.5">
          <li>
            <TopBarLanguage />
          </li>
          <li>
            <TopBarCurrency />
          </li>
        </ul>
      </div>
    </div>
  );
}
