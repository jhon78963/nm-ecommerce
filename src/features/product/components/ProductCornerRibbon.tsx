import { cn } from "@/lib/utils";

import "./product-corner-ribbon.css";

interface ProductCornerRibbonProps {
  label: string;
  position?: "left" | "right";
  variant?: "theme" | "dark";
  className?: string;
}

export function ProductCornerRibbon({
  label,
  position = "left",
  variant = "theme",
  className,
}: ProductCornerRibbonProps) {
  return (
    <div
      className={cn(
        "product-corner-ribbon",
        position === "right" ? "product-corner-ribbon--right" : "product-corner-ribbon--left",
        variant === "dark" && "product-corner-ribbon--dark",
        className,
      )}
      aria-label={label}
    >
      <span>{label}</span>
    </div>
  );
}
