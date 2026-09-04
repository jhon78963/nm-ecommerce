import { cn } from "@/lib/utils";

interface AuthOnlineBadgeProps {
  className?: string;
}

export function AuthOnlineBadge({ className }: AuthOnlineBadgeProps) {
  return (
    <span
      className={cn(
        "absolute -right-2 top-[20%] rounded-full bg-theme ring-2 ring-white",
        "size-[clamp(8px,0.6vw,10px)]",
        className,
      )}
      aria-hidden
    />
  );
}
