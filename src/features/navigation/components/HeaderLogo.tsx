"use client";

import Link from "next/link";
import Image from "next/image";

import {
  DEFAULT_BRAND_LOGO_URL,
  DEFAULT_BRAND_NAME,
} from "@/features/navigation/constants/branding";
import type { HeaderLogoProps } from "@/features/navigation/types/navigation.types";

export function HeaderLogo({
  logoUrl,
  brandName = DEFAULT_BRAND_NAME,
}: HeaderLogoProps) {
  const resolvedLogoUrl = logoUrl ?? DEFAULT_BRAND_LOGO_URL;
  const isFullLogoImage = resolvedLogoUrl !== DEFAULT_BRAND_LOGO_URL;

  if (isFullLogoImage) {
    return (
      <Link href="/" aria-label={brandName} className="inline-flex py-[clamp(15px,2.5vw,35px)]">
        <Image
          src={resolvedLogoUrl}
          alt={brandName}
          width={176}
          height={48}
          className="h-auto w-[clamp(110px,12vw,176px)] object-contain"
          priority
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label={brandName}
      className="inline-flex items-center gap-1.5 py-[clamp(15px,2.5vw,35px)]"
    >
      <Image
        src={DEFAULT_BRAND_LOGO_URL}
        alt=""
        width={36}
        height={36}
        className="size-9 shrink-0 object-contain"
        priority
        aria-hidden
      />
      <span className="text-xl font-bold uppercase tracking-wide text-[#333333]">
        {brandName}
      </span>
    </Link>
  );
}
