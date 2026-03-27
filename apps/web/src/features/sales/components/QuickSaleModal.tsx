import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { SaleToCreateType, ListOfCustomers } from "@car-wash/types";
import { Modal } from "@/components/Modal";
import { api } from "@/services/axiosInstance";
import { usePaymentMethods } from "@/features/settings/hooks/usePaymentMethods";
import { ProductSelect } from "@/features/inventory/components/ProductSelect";
import { CustomerSelect } from "./CustomerSelect";

// Local form schema — customerId is optional in the form (anonymous customer resolved on submit)
// z.number() used for numeric fields (paired with valueAsNumber: true in register)
const QuickSaleFormSchema = z.object({
  customerId: z.string().optional(),
  details: z
    .array(
      z.object({
        productId: z.string().uuid("Selecciona un producto"),
        quantity: z.number().positive("Cantidad > 0"),
        unitPrice: z.number().nonnegative("Precio >= 0"),
      })
    )
    .min(1, "Agrega al menos un producto"),
  paymentMethodId: z.string().uuid("Selecciona metodo de pago"),
  amountUsd: z.number().positive("Monto > 0"),
});

type QuickSaleFormValues = z.infer<typeof QuickSaleFormSchema>;

type QuickSaleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaleToCreateType) => void;
  isSubmitting: boolean;
};

export function QuickSaleModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: QuickSaleModalProps) {
  const { paymentMethods } = usePaymentMethods();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<QuickSaleFormValues>({
    resolver: zodResolver(QuickSaleFormSchema),
    defaultValues: {
      customerId: undefined,
      details: [{ productId: "", quantity: 1, unitPrice: 0 }],
      paymentMethodId: "",
      amountUsd: 0,
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
        customerId: undefined,
        details: [{ productId: "", quantity: 1, unitPrice: 0 }],
        paymentMethodId: "",
        amountUsd: 0,
      });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (formValues: QuickSaleFormValues) => {
    let resolvedCustomerId: string;

    if (formValues.customerId && formValues.customerId.trim() !== "") {
      // User selected a customer
      resolvedCustomerId = formValues.customerId;
    } else {
      // Resolve anonymous customer via API
      const res = await api.get<ListOfCustomers>("/api/customers", {
        params: { search: "Anonimo", limit: 1 },
      });
      const customers = res.data.data;

      if (customers.length === 0) {
        toast.error("No hay cliente anonimo configurado");
        return;
      }

      resolvedCustomerId = customers[0].id;
    }

    const payload: SaleToCreateType = {
      customerId: resolvedCustomerId,
      details: formValues.details.map((d) => ({
        productId: d.productId,
        quantity: d.quantity,
        unitPrice: d.unitPrice,
      })),
      payments: [
        {
          paymentMethodId: formValues.paymentMethodId,
          amountUsd: formValues.amountUsd,
        },
      ],
    };

    onSubmit(payload);
  };

  const grandTotal = watchedDetails
    ? watchedDetails.reduce(
        (sum, d) => sum + (Number(d.quantity) || 0) * (Number(d.unitPrice) || 0),
        0
      )
    : 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Venta Rapida" size="lg">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="mt-4 space-y-4"
      >
        {/* Customer (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente{" "}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <Controller
            control={control}
            name="customerId"
            render={({ field }) => (
              <CustomerSelect
                value={field.value ?? null}
                onChange={(val) => field.onChange(val ?? undefined)}
              />
            )}
          />
        </div>

        {/* Line items (useFieldArray) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">
              Productos <span className="text-red-500">*</span>
            </p>
            <button
              type="button"
              onClick={() =>
                append({ productId: "", quantity: 1, unitPrice: 0 })
              }
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
              const qty = Number(watchedDetails?.[index]?.quantity) || 0;
              const price = Number(watchedDetails?.[index]?.unitPrice) || 0;
              const subtotal = qty * price;
              const detailErrors = Array.isArray(errors.details)
                ? errors.details[index]
                : undefined;

              return (
                <div
                  key={field.id}
                  className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-500 mb-0.5">
                        Producto
                      </label>
                      <Controller
                        control={control}
                        name={`details.${index}.productId`}
                        render={({ field: productField }) => (
                          <ProductSelect
                            value={productField.value || null}
                            onChange={(val) =>
                              productField.onChange(val ?? "")
                            }
                            error={detailErrors?.productId?.message}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-0.5">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        {...register(`details.${index}.quantity`, { valueAsNumber: true })}
                        placeholder="1"
                        className={`w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 ${
                          detailErrors?.quantity
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                      {detailErrors?.quantity && (
                        <p className="mt-0.5 text-xs text-red-600">
                          {detailErrors.quantity.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-0.5">
                        Precio Unit. ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        {...register(`details.${index}.unitPrice`, { valueAsNumber: true })}
                        placeholder="0.00"
                        className={`w-full rounded-md border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 ${
                          detailErrors?.unitPrice
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                      {detailErrors?.unitPrice && (
                        <p className="mt-0.5 text-xs text-red-600">
                          {detailErrors.unitPrice.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-end pb-0.5">
                      <p className="text-xs text-gray-500">
                        Subtotal:{" "}
                        <span className="font-medium text-gray-800">
                          ${subtotal.toFixed(2)}
                        </span>
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
                      <Trash2 size={14} />
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
              <span className="text-base font-bold text-gray-900">
                ${grandTotal.toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* Payment section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Metodo de Pago <span className="text-red-500">*</span>
            </label>
            <select
              {...register("paymentMethodId")}
              className={`w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                errors.paymentMethodId ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar...</option>
              {paymentMethods.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.name}
                </option>
              ))}
            </select>
            {errors.paymentMethodId && (
              <p className="mt-1 text-xs text-red-600">
                {errors.paymentMethodId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto USD <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              {...register("amountUsd", { valueAsNumber: true })}
              placeholder="0.00"
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                errors.amountUsd ? "border-red-300 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.amountUsd && (
              <p className="mt-1 text-xs text-red-600">
                {errors.amountUsd.message}
              </p>
            )}
          </div>
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
            {isSubmitting ? "Creando..." : "Crear Venta"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
