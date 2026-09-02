import { cn } from "@/lib/utils";

interface SearchProductSkeletonProps {
  count?: number;
}

export function SearchProductSkeleton({ count = 4 }: SearchProductSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-square bg-[#f0f0f0]" />
          <div className="mt-3 h-4 w-3/4 bg-[#f0f0f0]" />
          <div className="mt-2 h-4 w-1/3 bg-[#f0f0f0]" />
        </div>
      ))}
    </>
  );
}

interface SearchCategorySkeletonProps {
  count?: number;
}

export function SearchCategorySkeleton({ count = 4 }: SearchCategorySkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className={cn("h-5 w-20 animate-pulse rounded bg-[#f0f0f0]")}
        />
      ))}
    </>
  );
}
