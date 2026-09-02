"use client";

import { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";

import { useClickOutside } from "@/features/navigation/hooks/use-click-outside";
import { cn } from "@/lib/utils";

interface TopBarDropdownProps<T extends string> {
  value: T;
  options: { value: T; label: string; prefix?: string }[];
  onChange: (value: T) => void;
  className?: string;
}

export function TopBarDropdown<T extends string>({
  value,
  options,
  onChange,
  className,
}: TopBarDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? options[0];

  const close = useCallback(() => setIsOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(close, isOpen);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-medium text-white"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selected.prefix ? <span>{selected.prefix}</span> : null}
        <span>{selected.label}</span>
        <ChevronDown className="size-4 opacity-80" />
      </button>

      {isOpen ? (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 min-w-[120px] border border-[#eee] bg-white py-1 shadow-sm"
        >
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  close();
                }}
                className={cn(
                  "flex w-full items-center justify-center gap-2.5 px-4 py-2 text-sm font-medium text-[#333]",
                  "hover:bg-theme hover:text-white",
                  option.value === value && "bg-theme text-white",
                )}
              >
                {option.prefix ? <span>{option.prefix}</span> : null}
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
