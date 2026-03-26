import { Modal } from "@/components/Modal";
import type { PublicPurchase } from "@car-wash/types";

type PurchaseDetailModalProps = {
  purchase: PublicPurchase | null;
  isOpen: boolean;
  onClose: () => void;
};

export function PurchaseDetailModal({ purchase, isOpen, onClose }: PurchaseDetailModalProps) {
  if (!purchase) return null;

  const totalDetail = purchase.details.reduce((sum, d) => sum + d.subtotalUsd, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalle de Compra — ${purchase.id.slice(0, 8)}...`}
      size="lg"
    >
      <div className="mt-4 space-y-5">
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-0.5">Proveedor</p>
            <p className="font-medium text-gray-900">{purchase.providerName}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Fecha</p>
            <p className="font-medium text-gray-900">
              {new Date(purchase.purchaseDate).toLocaleDateString("es-VE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Tasa del Dolar</p>
            <p className="font-medium text-gray-900">Bs. {purchase.dollarRate.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Metodo de Pago</p>
            <p className="font-medium text-gray-900">{purchase.paymentMethodName ?? "—"}</p>
          </div>
          {purchase.notes && (
            <div className="col-span-2">
              <p className="text-gray-500 mb-0.5">Notas</p>
              <p className="font-medium text-gray-900">{purchase.notes}</p>
            </div>
          )}
        </div>

        {/* Products table */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Productos</p>
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2 text-right">Cantidad</th>
                  <th className="px-3 py-2 text-right">Costo Unitario</th>
                  <th className="px-3 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchase.details.map((detail) => (
                  <tr key={detail.id} className="bg-white">
                    <td className="px-3 py-2 text-gray-900">{detail.productName}</td>
                    <td className="px-3 py-2 text-right text-gray-700">{detail.quantity}</td>
                    <td className="px-3 py-2 text-right text-gray-700">${detail.unitCostUsd.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right text-gray-700">${detail.subtotalUsd.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">Total USD</p>
          <p className="text-xl font-bold text-gray-900">${totalDetail.toFixed(2)}</p>
        </div>
      </div>
    </Modal>
  );
}
