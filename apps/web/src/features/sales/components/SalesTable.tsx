import { ShoppingCart } from "lucide-react";
import type { PublicSale } from "@car-wash/types";
import { SaleTableRow } from "./SaleTableRow";

type SalesTableProps = {
  sales: PublicSale[];
  onView: (sale: PublicSale) => void;
};

export function SalesTable({ sales, onView }: SalesTableProps) {
  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <ShoppingCart size={48} className="mb-3 text-gray-300" />
        <p className="text-sm text-gray-500">No se encontraron ventas</p>
        <p className="text-xs text-gray-400 mt-1">
          Intenta ajustar los filtros
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">ID Venta</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Total Pagado</th>
              <th className="px-4 py-3">Metodo de Pago</th>
              <th className="px-4 py-3">Hora</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sales.map((sale) => (
              <SaleTableRow key={sale.id} sale={sale} onView={onView} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
