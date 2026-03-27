import { useState } from "react";
import { Modal } from "@/components/Modal";
import type { PublicSale } from "@car-wash/types";
import { SaleStatus } from "@car-wash/types";
import { useSale, useSalesMutations } from "../hooks/useSales";
import { SaleStatusBadge } from "./SaleStatusBadge";

type SaleDetailModalProps = {
  sale: PublicSale | null;
  isOpen: boolean;
  onClose: () => void;
};

function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const STATUS_LABELS: Record<SaleStatus, string> = {
  [SaleStatus.COMPLETED]: "Completada",
  [SaleStatus.REFUNDED]: "Reembolsada",
  [SaleStatus.CANCELLED]: "Cancelada",
};

export function SaleDetailModal({ sale, isOpen, onClose }: SaleDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<SaleStatus>(
    sale?.status ?? SaleStatus.COMPLETED
  );

  const saleQuery = useSale(sale?.id ?? null);
  const { updateStatus, isUpdatingStatus } = useSalesMutations();

  const displaySale = saleQuery.data ?? sale;

  if (!displaySale) return null;

  const handleStatusChange = () => {
    updateStatus({ id: displaySale.id, status: selectedStatus });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de Venta"
      size="lg"
    >
      <div className="mt-1 mb-1">
        <p className="text-xs text-gray-400">V-{displaySale.id.slice(0, 8)}</p>
      </div>

      <div className="mt-4 space-y-5">
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-0.5">Cliente</p>
            <p className="font-medium text-gray-900">{displaySale.customer.fullName}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Fecha</p>
            <p className="font-medium text-gray-900">{formatDate(displaySale.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Total USD</p>
            <p className="font-medium text-gray-900">${Number(displaySale.totalUSD).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Total VES</p>
            <p className="font-medium text-gray-900">Bs. {Number(displaySale.totalVES).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Tasa</p>
            <p className="font-medium text-gray-900">
              1 USD = {Number(displaySale.dollarRate).toFixed(2)} VES
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Estado</p>
            <SaleStatusBadge status={displaySale.status} />
          </div>
        </div>

        {/* Status change section */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <label className="text-sm text-gray-600 font-medium whitespace-nowrap">
            Cambiar Estado:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as SaleStatus)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            {Object.values(SaleStatus).map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleStatusChange}
            disabled={isUpdatingStatus || selectedStatus === displaySale.status}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {isUpdatingStatus ? "Guardando..." : "Cambiar Estado"}
          </button>
        </div>

        {/* Sale details (line items) */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Articulos</p>
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <th className="px-3 py-2">Articulo</th>
                  <th className="px-3 py-2 text-right">Cantidad</th>
                  <th className="px-3 py-2 text-right">Precio Unit.</th>
                  <th className="px-3 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displaySale.saleDetails.map((detail) => {
                  const itemName = detail.product?.name ?? detail.service?.name ?? "—";
                  return (
                    <tr key={detail.id} className="bg-white">
                      <td className="px-3 py-2 text-gray-900">{itemName}</td>
                      <td className="px-3 py-2 text-right text-gray-700">
                        {detail.quantity}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700">
                        ${Number(detail.unitPrice).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700">
                        ${Number(detail.subtotal).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payments section — only when defined and non-empty */}
        {displaySale.payments && displaySale.payments.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Pagos</p>
            <div className="space-y-2">
              {displaySale.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {payment.paymentMethod.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${Number(payment.amountUsd).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Bs. {Number(payment.amountVes).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close button */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
