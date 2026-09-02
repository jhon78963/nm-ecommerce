"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function FilterSection({ title, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#f1f1f1] py-5 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between text-left"
      >
        <h5 className="text-[13px] font-semibold uppercase tracking-wider text-[#222]">
          {title}
        </h5>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-[#999] transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}
