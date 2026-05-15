import { SearchInput } from "@/components/SearchInput";
import type { PublicPaymentMethod } from "@car-wash/types";

type PurchasesFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
  paymentMethodId: string;
  onPaymentMethodChange: (value: string) => void;
  paymentMethods: PublicPaymentMethod[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

const inputClass =
  "rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900";

export function PurchasesFilterBar({
  search,
  onSearchChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  paymentMethodId,
  onPaymentMethodChange,
  paymentMethods,
  hasActiveFilters,
  onClearFilters,
}: PurchasesFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex-1 min-w-[200px] max-w-xs">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Buscar por proveedor..."
        />
      </div>

      <input
        type="date"
        value={fromDate}
        onChange={(e) => onFromDateChange(e.target.value)}
        className={inputClass}
        aria-label="Desde"
        title="Desde"
      />

      <input
        type="date"
        value={toDate}
        onChange={(e) => onToDateChange(e.target.value)}
        className={inputClass}
        aria-label="Hasta"
        title="Hasta"
      />

      <select
        value={paymentMethodId}
        onChange={(e) => onPaymentMethodChange(e.target.value)}
        className={inputClass}
      >
        <option value="">Todos los metodos</option>
        {paymentMethods.map((pm) => (
          <option key={pm.id} value={pm.id}>
            {pm.name}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm text-gray-500 hover:text-gray-800 underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
