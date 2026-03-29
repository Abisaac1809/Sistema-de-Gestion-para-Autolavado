import { useMemo } from "react";
import type { PublicSale } from "@car-wash/types";
import { DataTable, type Column } from "@/components/DataTable";
import { TableActions } from "@/components/TableActions";
import { SaleStatusBadge } from "./SaleStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";

type SalesTableProps = {
  sales: PublicSale[];
  isLoading?: boolean;
  onView: (sale: PublicSale) => void;
};

export function SalesTable({ sales, isLoading, onView }: SalesTableProps) {
  const columns = useMemo<Column<PublicSale>[]>(
    () => [
      {
        header: "ID Venta",
        render: (s) => (
          <span className="font-mono text-gray-600">V-{s.id.slice(0, 8)}</span>
        ),
      },
      {
        header: "Cliente",
        render: (s) => <span className="font-medium text-gray-900">{s.customer.fullName}</span>,
      },
      {
        header: "Total Pagado",
        render: (s) => <span className="text-gray-700">${s.totalUSD.toFixed(2)}</span>,
      },
      {
        header: "Metodo de Pago",
        render: (s) => {
          const firstPayment = s.payments && s.payments.length > 0 ? s.payments[0] : null;
          return firstPayment ? (
            <PaymentMethodBadge name={firstPayment.paymentMethod.name} />
          ) : (
            <span className="text-gray-400">—</span>
          );
        },
      },
      {
        header: "Hora",
        render: (s) => (
          <span className="text-gray-600">
            {new Date(s.createdAt).toLocaleTimeString("es-VE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ),
      },
      {
        header: "Estado",
        render: (s) => <SaleStatusBadge status={s.status} />,
      },
      {
        header: "Acciones",
        align: "right",
        render: (s) => <TableActions onView={() => onView(s)} />,
      },
    ],
    [onView],
  );

  return (
    <DataTable
      columns={columns}
      data={sales}
      keyExtractor={(s) => s.id}
      isLoading={isLoading}
      emptyMessage="No se encontraron ventas"
    />
  );
}
