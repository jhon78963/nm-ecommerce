import { Search } from "lucide-react";

export function SearchEmptyState() {
  return (
    <div className="collection-no-data flex flex-col items-center bg-[#f8f8f8] px-6 py-16 text-center">
      <Search className="mb-4 size-12 text-[#ccc]" strokeWidth={1.5} />
      <h4 className="text-lg font-semibold text-[#333]">Producto no encontrado</h4>
      <p className="mt-2 max-w-md text-sm text-[#6a6a6a]">
        Verifica si escribiste algo mal o intenta buscar de otra forma.
      </p>
    </div>
  );
}
