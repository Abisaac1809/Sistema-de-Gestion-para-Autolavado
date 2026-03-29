import { useMemo } from "react";
import type { PublicPurchase } from "@car-wash/types";
import { DataTable, type Column } from "@/components/DataTable";
import { TableActions } from "@/components/TableActions";

type PurchasesTableProps = {
  purchases: PublicPurchase[];
  isLoading: boolean;
  onView: (purchase: PublicPurchase) => void;
  onDelete: (purchase: PublicPurchase) => void;
  disabled?: boolean;
};

function getPaymentMethodBadgeClass(name: string | null): string {
  if (!name) return "bg-gray-100 text-gray-600";
  const lower = name.toLowerCase();
  if (lower.includes("efectivo") || lower.includes("cash")) return "bg-green-100 text-green-700";
  if (lower.includes("transfer") || lower.includes("pago movil")) return "bg-blue-100 text-blue-700";
  if (
    lower.includes("tarjeta") ||
    lower.includes("card") ||
    lower.includes("credito") ||
    lower.includes("debito")
  )
    return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-600";
}

export function PurchasesTable({
  purchases,
  isLoading,
  onView,
  onDelete,
  disabled = false,
}: PurchasesTableProps) {
  const columns = useMemo<Column<PublicPurchase>[]>(
    () => [
      {
        header: "ID Compra",
        render: (p) => (
          <span className="font-mono text-gray-600">{p.id.slice(0, 8)}...</span>
        ),
      },
      {
        header: "Proveedor",
        render: (p) => <span className="font-medium text-gray-900">{p.providerName}</span>,
      },
      {
        header: "Total Pagado",
        render: (p) => <span className="text-gray-700">${p.totalUsd.toFixed(2)}</span>,
      },
      {
        header: "Metodo de Pago",
        render: (p) =>
          p.paymentMethodName ? (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodBadgeClass(p.paymentMethodName)}`}
            >
              {p.paymentMethodName}
            </span>
          ) : (
            <span className="text-gray-400">—</span>
          ),
      },
      {
        header: "Fecha",
        render: (p) => (
          <span className="text-gray-600">
            {new Date(p.purchaseDate).toLocaleDateString("es-VE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        header: "Acciones",
        align: "right",
        render: (p) => (
          <TableActions
            onView={() => onView(p)}
            onDelete={() => onDelete(p)}
            disabled={disabled}
          />
        ),
      },
    ],
    [onView, onDelete, disabled],
  );

  return (
    <DataTable
      columns={columns}
      data={purchases}
      keyExtractor={(p) => p.id}
      isLoading={isLoading}
      emptyMessage="No se encontraron compras"
    />
  );
}
