import { Search } from "lucide-react";
import { SaleStatus } from "@car-wash/types";
import type { PublicPaymentMethod } from "@car-wash/types";
import type { SaleFiltersState, SaleFiltersActions } from "../types/sales.dtos";

type SalesFilterBarProps = {
  filters: SaleFiltersState;
  filterActions: SaleFiltersActions;
  paymentMethods: PublicPaymentMethod[];
};

const isFilterActive = (filters: SaleFiltersState): boolean =>
  !!(
    filters.search ||
    filters.fromDate ||
    filters.toDate ||
    filters.paymentMethodId ||
    filters.status
  );

export function SalesFilterBar({
  filters,
  filterActions,
  paymentMethods,
}: SalesFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-4">
      {/* Search input */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Buscar por cliente o placa..."
          value={filters.search}
          onChange={(e) => filterActions.setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* From date */}
      <input
        type="date"
        value={filters.fromDate}
        onChange={(e) => filterActions.setFromDate(e.target.value)}
        aria-label="Desde"
        title="Desde"
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
      />

      {/* To date */}
      <input
        type="date"
        value={filters.toDate}
        onChange={(e) => filterActions.setToDate(e.target.value)}
        aria-label="Hasta"
        title="Hasta"
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
      />

      {/* Payment method select */}
      <select
        value={filters.paymentMethodId}
        onChange={(e) => filterActions.setPaymentMethodId(e.target.value)}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
      >
        <option value="">Todos los metodos</option>
        {paymentMethods.map((pm) => (
          <option key={pm.id} value={pm.id}>
            {pm.name}
          </option>
        ))}
      </select>

      {/* Status select */}
      <select
        value={filters.status}
        onChange={(e) =>
          filterActions.setStatus(e.target.value as SaleFiltersState["status"])
        }
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
      >
        <option value="">Todos los estados</option>
        <option value={SaleStatus.COMPLETED}>Completada</option>
        <option value={SaleStatus.REFUNDED}>Reembolsada</option>
        <option value={SaleStatus.CANCELLED}>Cancelada</option>
      </select>

      {/* Clear filters */}
      {isFilterActive(filters) && (
        <button
          type="button"
          onClick={filterActions.resetFilters}
          className="text-sm text-gray-500 hover:text-gray-800 underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
