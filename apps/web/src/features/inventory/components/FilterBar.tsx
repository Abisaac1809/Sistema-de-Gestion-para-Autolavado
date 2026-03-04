import { Search } from "lucide-react";
import { CategorySelect } from "./CategorySelect";

type FilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string | null;
  onCategoryChange: (value: string | null) => void;
  isForSale: "all" | "true" | "false";
  onIsForSaleChange: (value: "all" | "true" | "false") => void;
  onClearFilters: () => void;
};

const inputClass =
  "rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 w-full";

const labelClass = "text-xs font-medium text-gray-500 mb-1 block";

export function FilterBar({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  isForSale,
  onIsForSaleChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters =
    search !== "" || categoryId !== null || isForSale !== "all";

  return (
    <div className="flex gap-3 items-end flex-wrap">
      {/* Search input */}
      <div className="w-full sm:w-64">
        <label className={labelClass}>Buscar</label>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar producto..."
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>

      {/* Category select */}
      <div className="w-full sm:w-56">
        <label className={labelClass}>Categoria</label>
        <CategorySelect value={categoryId} onChange={onCategoryChange} />
      </div>

      {/* isForSale dropdown */}
      <div className="w-full sm:w-44">
        <label className={labelClass}>Estado de venta</label>
        <select
          value={isForSale}
          onChange={(e) =>
            onIsForSaleChange(e.target.value as "all" | "true" | "false")
          }
          className={inputClass}
        >
          <option value="all">Todos</option>
          <option value="true">En venta</option>
          <option value="false">No en venta</option>
        </select>
      </div>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <div className="pb-0.5">
          <button
            type="button"
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
