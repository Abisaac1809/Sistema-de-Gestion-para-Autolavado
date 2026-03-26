import { Eye, Trash2, ShoppingBag } from "lucide-react";
import type { PublicPurchase } from "@car-wash/types";

type PurchasesTableProps = {
  purchases: PublicPurchase[];
  onView: (purchase: PublicPurchase) => void;
  onDelete: (purchase: PublicPurchase) => void;
  disabled?: boolean;
};

function getPaymentMethodBadgeClass(name: string | null): string {
  if (!name) return "bg-gray-100 text-gray-600";
  const lower = name.toLowerCase();
  if (lower.includes("efectivo") || lower.includes("cash")) return "bg-green-100 text-green-700";
  if (lower.includes("transfer") || lower.includes("pago movil")) return "bg-blue-100 text-blue-700";
  if (lower.includes("tarjeta") || lower.includes("card") || lower.includes("credito") || lower.includes("debito")) return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-600";
}

export function PurchasesTable({ purchases, onView, onDelete, disabled = false }: PurchasesTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <ShoppingBag size={40} className="mb-3" />
        <p className="text-sm">No se encontraron compras</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
            <th className="px-4 py-3">ID Compra</th>
            <th className="px-4 py-3">Proveedor</th>
            <th className="px-4 py-3">Total Pagado</th>
            <th className="px-4 py-3">Metodo de Pago</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {purchases.map((purchase) => (
            <tr key={purchase.id} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-mono text-gray-600">
                {purchase.id.slice(0, 8)}...
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">
                {purchase.providerName}
              </td>
              <td className="px-4 py-3 text-gray-700">
                ${purchase.totalUsd.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                {purchase.paymentMethodName ? (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodBadgeClass(purchase.paymentMethodName)}`}>
                    {purchase.paymentMethodName}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {new Date(purchase.purchaseDate).toLocaleDateString("es-VE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onView(purchase)}
                    disabled={disabled}
                    className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Ver detalle"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(purchase)}
                    disabled={disabled}
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Eliminar compra"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
