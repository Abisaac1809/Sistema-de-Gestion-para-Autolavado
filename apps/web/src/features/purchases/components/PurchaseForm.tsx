import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { PurchaseDetailToCreate, type PurchaseToCreateType } from "@car-wash/types";
import { Modal } from "@/components/Modal";
import { SaveButton } from "@/components/buttons/SaveButton";
import { CancelButton } from "@/components/buttons/CancelButton";
import { usePaymentMethods } from "@/features/settings/hooks/usePaymentMethods";

// Local form schema uses string for purchaseDate since HTML date input returns strings
const PurchaseFormSchema = z.object({
  providerName: z
    .string()
    .min(2, "El nombre del proveedor debe tener al menos 2 caracteres")
    .max(100, "El nombre del proveedor no debe exceder 100 caracteres"),
  purchaseDate: z.string().min(1, "La fecha es requerida"),
  dollarRate: z.number().positive("La tasa de cambio debe ser mayor a 0"),
  paymentMethodId: z.string().uuid("ID de metodo de pago invalido").optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  details: z.array(PurchaseDetailToCreate).min(1, "Debe incluir al menos un producto"),
});

type PurchaseFormValues = z.infer<typeof PurchaseFormSchema>;

type PurchaseFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PurchaseToCreateType) => void;
  isSubmitting: boolean;
};

const todayStr = () => new Date().toISOString().split("T")[0];

export function PurchaseForm({ isOpen, onClose, onSubmit, isSubmitting }: PurchaseFormProps) {
  const { paymentMethods } = usePaymentMethods();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<PurchaseFormValues>({
    resolver: zodResolver(PurchaseFormSchema),
    defaultValues: {
      providerName: "",
      purchaseDate: todayStr(),
      dollarRate: 0,
      paymentMethodId: null,
      notes: null,
      details: [{ productId: "", quantity: 1, unitCostUsd: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const watchedDetails = watch("details");

  useEffect(() => {
    if (isOpen) {
      reset({
        providerName: "",
        purchaseDate: todayStr(),
        dollarRate: 0,
        paymentMethodId: null,
        notes: null,
        details: [{ productId: "", quantity: 1, unitCostUsd: 0 }],
      });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: PurchaseFormValues) => {
    const payload: PurchaseToCreateType = {
      ...data,
      purchaseDate: new Date(data.purchaseDate),
      paymentMethodId: data.paymentMethodId || null,
      notes: data.notes || null,
    };
    onSubmit(payload);
  };

  const grandTotal = watchedDetails
    ? watchedDetails.reduce((sum, d) => sum + (d.quantity || 0) * (d.unitCostUsd || 0), 0)
    : 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrar Compra" size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 space-y-4">
        {/* Row 1: Proveedor + Fecha */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proveedor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("providerName")}
              placeholder="Nombre del proveedor"
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                errors.providerName ? "border-red-300 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.providerName && (
              <p className="mt-1 text-xs text-red-600">{errors.providerName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Compra <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("purchaseDate")}
              defaultValue={todayStr()}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                errors.purchaseDate ? "border-red-300 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.purchaseDate && (
              <p className="mt-1 text-xs text-red-600">{errors.purchaseDate.message}</p>
            )}
          </div>
        </div>

        {/* Row 2: Tasa del Dolar + Metodo de Pago */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tasa del Dolar (Bs/$) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              {...register("dollarRate", { valueAsNumber: true })}
              placeholder="0.00"
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                errors.dollarRate ? "border-red-300 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.dollarRate && (
              <p className="mt-1 text-xs text-red-600">{errors.dollarRate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Metodo de Pago
            </label>
            <select
              {...register("paymentMethodId")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Sin metodo / Efectivo</option>
              {paymentMethods.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notas */}
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

        {/* Lineas de Productos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">
              Productos <span className="text-red-500">*</span>
            </p>
            <button
              type="button"
              onClick={() => append({ productId: "", quantity: 1, unitCostUsd: 0 })}
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50 transition-colors"
            >
              <Plus size={12} />
              Agregar producto
            </button>
          </div>

          {errors.details && !Array.isArray(errors.details) && (
            <p className="mb-2 text-xs text-red-600">{errors.details.message}</p>
          )}

          <div className="space-y-2">
            {fields.map((field, index) => {
              const qty = watchedDetails?.[index]?.quantity ?? 0;
              const cost = watchedDetails?.[index]?.unitCostUsd ?? 0;
              const subtotal = qty * cost;
              const detailErrors = Array.isArray(errors.details) ? errors.details[index] : undefined;

              return (
                <div key={field.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-500 mb-0.5">ID del Producto (UUID)</label>
                      <input
                        type="text"
                        {...register(`details.${index}.productId`)}
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        className={`w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 font-mono ${
                          detailErrors?.productId ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      {detailErrors?.productId && (
                        <p className="mt-0.5 text-xs text-red-600">{detailErrors.productId.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-0.5">Cantidad</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        {...register(`details.${index}.quantity`, { valueAsNumber: true })}
                        placeholder="1"
                        className={`w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 ${
                          detailErrors?.quantity ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      {detailErrors?.quantity && (
                        <p className="mt-0.5 text-xs text-red-600">{detailErrors.quantity.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-0.5">Costo Unitario ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        {...register(`details.${index}.unitCostUsd`, { valueAsNumber: true })}
                        placeholder="0.00"
                        className={`w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 ${
                          detailErrors?.unitCostUsd ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      {detailErrors?.unitCostUsd && (
                        <p className="mt-0.5 text-xs text-red-600">{detailErrors.unitCostUsd.message}</p>
                      )}
                    </div>
                    <div className="flex items-end pb-0.5">
                      <p className="text-xs text-gray-500">
                        Subtotal:{" "}
                        <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-5 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      aria-label="Eliminar linea"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grand total */}
          <div className="mt-3 flex justify-end">
            <p className="text-sm text-gray-600">
              Total estimado:{" "}
              <span className="text-base font-bold text-gray-900">${grandTotal.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <CancelButton onClick={handleClose} />
          <SaveButton
            isSubmitting={isSubmitting}
            label="Registrar Compra"
            loadingLabel="Registrando..."
          />
        </div>
      </form>
    </Modal>
  );
}
