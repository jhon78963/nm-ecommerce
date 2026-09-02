export function WishlistSkeleton() {
  return (
    <div className="box-loader blur-bg animate-pulse space-y-4 py-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-24 border border-[#eee] bg-[#f8f8f8]" />
      ))}
    </div>
  );
}
