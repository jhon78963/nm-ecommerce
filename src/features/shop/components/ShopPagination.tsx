"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildFilterUrl } from "../utils/shop-url.utils";

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function ShopPagination({ currentPage, totalPages }: ShopPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const pageUrl = (page: number) =>
    buildFilterUrl(pathname, searchParams, { page: String(page) });

  const navBtnClass = (disabled: boolean) =>
    cn(
      "flex h-9 w-9 items-center justify-center rounded border text-sm transition-colors",
      disabled
        ? "pointer-events-none border-[#e5e5e5] text-[#ccc]"
        : "border-[#e5e5e5] text-[#555] hover:border-theme hover:text-theme",
    );

  const pageBtnClass = (isActive: boolean) =>
    cn(
      "flex h-9 w-9 items-center justify-center rounded border text-[13px] font-medium transition-colors",
      isActive
        ? "border-theme bg-theme text-white"
        : "border-[#e5e5e5] text-[#555] hover:border-theme hover:text-theme",
    );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Paginación">
      <Link href={pageUrl(currentPage - 1)} aria-disabled={currentPage === 1} className={navBtnClass(currentPage === 1)}>
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((page) => (
        <Link key={page} href={pageUrl(page)} className={pageBtnClass(page === currentPage)}>
          {page}
        </Link>
      ))}

      <Link href={pageUrl(currentPage + 1)} aria-disabled={currentPage === totalPages} className={navBtnClass(currentPage === totalPages)}>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
