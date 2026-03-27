import { Eye } from "lucide-react";
import type { PublicSale } from "@car-wash/types";
import { SaleStatusBadge } from "./SaleStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";

type SaleTableRowProps = {
  sale: PublicSale;
  onView: (sale: PublicSale) => void;
};

export function SaleTableRow({ sale, onView }: SaleTableRowProps) {
  const firstPayment =
    sale.payments && sale.payments.length > 0 ? sale.payments[0] : null;

  const timeString = new Date(sale.createdAt).toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      {/* ID */}
      <td className="px-4 py-3 font-mono text-gray-600 text-sm">
        V-{sale.id.slice(0, 8)}
      </td>

      {/* Customer name */}
      <td className="px-4 py-3 font-medium text-gray-900 text-sm">
        {sale.customer.fullName}
      </td>

      {/* Total paid */}
      <td className="px-4 py-3 text-gray-700 text-sm">
        ${sale.totalUSD.toFixed(2)}
      </td>

      {/* Payment method badge */}
      <td className="px-4 py-3 text-sm">
        {firstPayment ? (
          <PaymentMethodBadge name={firstPayment.paymentMethod.name} />
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>

      {/* Time */}
      <td className="px-4 py-3 text-gray-600 text-sm">{timeString}</td>

      {/* Status */}
      <td className="px-4 py-3 text-sm">
        <SaleStatusBadge status={sale.status} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onView(sale)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Ver detalle"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
