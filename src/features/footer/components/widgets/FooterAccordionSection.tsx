"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FooterAccordionSectionProps {
  title: string;
  children: ReactNode;
}

export function FooterAccordionSection({ title, children }: FooterAccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="sub-title"
      onClick={() => setIsOpen((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsOpen((current) => !current);
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
    >
      <div className={cn("footer-title", isOpen && "show")}>
        <h4>{title}</h4>
      </div>
      <div className="footer-content" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
