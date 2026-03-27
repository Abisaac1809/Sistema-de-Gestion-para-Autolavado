import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OrderSummary, PaymentToCreateType } from "@car-wash/types";
import { Modal } from "@/components/Modal";
import { usePaymentMethods } from "@/features/settings/hooks/usePaymentMethods";
import type { AddPaymentArgs } from "../types/orders.dtos";

const PaymentFormSchema = z.object({
  paymentMethodId: z.string().uuid("Seleccione un metodo de pago"),
  currency: z.enum(["USD", "VES"]),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof PaymentFormSchema>;

type OrderPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: OrderSummary | null;
  onAddPayment: (payload: AddPaymentArgs) => void;
  isSubmitting: boolean;
};

export function OrderPaymentModal({
  isOpen,
  onClose,
  order,
  onAddPayment,
  isSubmitting,
}: OrderPaymentModalProps) {
  const { paymentMethods } = usePaymentMethods();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      paymentMethodId: "",
      currency: "USD",
      amount: undefined,
      notes: "",
    },
  });

  const currency = watch("currency");

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: PaymentFormValues) => {
    if (!order) return;

    const payload: PaymentToCreateType =
      data.currency === "USD"
        ? { paymentMethodId: data.paymentMethodId, amountUsd: data.amount, notes: data.notes }
        : { paymentMethodId: data.paymentMethodId, amountVes: data.amount, notes: data.notes };

    onAddPayment({ orderId: order.id, payload });
    reset();
  };

  const totalPaid = order?.totalPaidUSD ?? 0;
  const total = order?.totalUSD ?? 0;
  const remaining = Math.max(0, total - totalPaid);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrar Pago" size="md">
      {order && (
        <div className="mt-4 space-y-4">
          {/* Order summary */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Cliente</span>
              <span className="font-medium text-gray-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehiculo</span>
              <span className="font-medium text-gray-900">
                {order.vehicleModel}
                {order.vehiclePlate ? ` (${order.vehiclePlate})` : ""}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-1.5 mt-1.5">
              <span className="text-gray-500">Total</span>
              <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pagado</span>
              <span className="font-medium text-green-600">${totalPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-1.5 mt-1.5">
              <span className="text-gray-700">Restante</span>
              <span className={remaining > 0 ? "text-red-600" : "text-green-600"}>
                ${remaining.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Payment method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metodo de Pago <span className="text-red-500">*</span>
              </label>
              <select
                {...register("paymentMethodId")}
                className={`w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                  errors.paymentMethodId ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar metodo...</option>
                {paymentMethods.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.name}
                  </option>
                ))}
              </select>
              {errors.paymentMethodId && (
                <p className="mt-1 text-xs text-red-600">{errors.paymentMethodId.message}</p>
              )}
            </div>

            {/* Currency toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <div className="flex rounded-md border border-gray-300 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => field.onChange("USD")}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        field.value === "USD"
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("VES")}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        field.value === "VES"
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      VES (Bs)
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto ({currency === "USD" ? "$" : "Bs"}) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...register("amount", { valueAsNumber: true })}
                placeholder="0.00"
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                  errors.amount ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                }`}
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                {...register("notes")}
                rows={2}
                placeholder="Observaciones adicionales..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Registrando..." : "Registrar Pago"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
