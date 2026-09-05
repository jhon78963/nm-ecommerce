export default function Loading() {
  return (
    <div className="flex flex-1 flex-col bg-white" aria-busy="true" aria-live="polite">
      <div className="h-[min(56vw,520px)] w-full animate-pulse bg-[#f3f3f3]" />
      <div className="mx-auto my-6 h-32 w-[min(100%,1400px)] animate-pulse bg-[#f3f3f3] px-4" />
      <div className="mx-auto my-6 h-80 w-[min(100%,1400px)] animate-pulse bg-[#f3f3f3] px-4" />
      <p className="sr-only">Cargando inicio...</p>
    </div>
  );
}
