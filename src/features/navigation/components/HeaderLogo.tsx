"use client";

import Link from "next/link";
import Image from "next/image";

import type { HeaderLogoProps } from "@/features/navigation/types/navigation.types";
import { cn } from "@/lib/utils";

const DEFAULT_BRAND_NAME = "Novedades Maritex";
const DEFAULT_INITIALS = "NM";

export function HeaderLogo({
  logoUrl,
  brandName = DEFAULT_BRAND_NAME,
  initials = DEFAULT_INITIALS,
}: HeaderLogoProps) {
  return (
    <Link href="/" className="inline-flex items-center gap-1.5 py-[clamp(15px,2.5vw,35px)]">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={brandName}
          width={176}
          height={48}
          className="h-auto w-[clamp(110px,12vw,176px)] object-contain"
          priority
        />
      ) : (
        <>
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded",
              "bg-theme text-sm font-semibold text-white shadow-sm",
            )}
          >
            {initials}
          </span>
          <span className="text-xl font-bold uppercase tracking-wide text-[#333333]">
            {brandName}
          </span>
        </>
      )}
    </Link>
  );
}
