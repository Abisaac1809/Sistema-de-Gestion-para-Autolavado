import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import type { OrderToCreateType } from "@car-wash/types";
import { Drawer } from "@/components/Drawer";
import { ProductSelect } from "@/features/inventory/components/ProductSelect";
import { CustomerSelect } from "./CustomerSelect";
import { ServiceSelect } from "./ServiceSelect";
import { NewOrderFormSchema, type NewOrderFormValues } from "../schemas/newOrderForm.schema";

type NewOrderDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrderToCreateType) => void;
  isSubmitting: boolean;
};

export function NewOrderDrawer({ isOpen, onClose, onSubmit, isSubmitting }: NewOrderDrawerProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewOrderFormValues>({
    resolver: zodResolver(NewOrderFormSchema),
    defaultValues: {
      customerId: "",
      vehiclePlate: null,
      vehicleModel: "",
      details: [{ itemType: "service", serviceId: null, productId: null, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        customerId: "",
        vehiclePlate: null,
        vehicleModel: "",
        details: [{ itemType: "service", serviceId: null, productId: null, quantity: 1 }],
      });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: NewOrderFormValues) => {
    const payload: OrderToCreateType = {
      customerId: data.customerId,
      vehiclePlate: data.vehiclePlate ?? null,
      vehicleModel: data.vehicleModel,
      details: data.details.map((item) => {
        if (item.itemType === "service") {
          return {
            serviceId: item.serviceId ?? undefined,
            productId: undefined,
            quantity: item.quantity,
          };
        } else {
          return {
            serviceId: undefined,
            productId: item.productId ?? undefined,
            quantity: item.quantity,
          };
        }
      }),
    };
    onSubmit(payload);
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Nueva Orden" width="xl">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Customer select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="customerId"
            render={({ field }) => (
              <CustomerSelect
                value={field.value || null}
                onChange={(val) => field.onChange(val ?? "")}
                error={errors.customerId?.message}
              />
            )}
          />
        </div>

        {/* Vehicle row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo del vehiculo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("vehicleModel")}
              placeholder="Toyota Corolla"
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                errors.vehicleModel ? "border-red-300 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.vehicleModel && (
              <p className="mt-1 text-xs text-red-600">{errors.vehicleModel.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placa <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              {...register("vehiclePlate")}
              placeholder="ABC-123"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Line items section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">
              Items de la Orden <span className="text-red-500">*</span>
            </p>
            <button
              type="button"
              onClick={() =>
                append({ itemType: "service", serviceId: null, productId: null, quantity: 1 })
              }
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50 transition-colors"
            >
              <Plus size={12} />
              Agregar Item
            </button>
          </div>

          {errors.details && !Array.isArray(errors.details) && (
            <p className="mb-2 text-xs text-red-600">{errors.details.message}</p>
          )}

          <div className="space-y-2">
            {fields.map((field, index) => {
              const itemType = watch(`details.${index}.itemType`);
              const detailErrors = Array.isArray(errors.details)
                ? errors.details[index]
                : undefined;

              return (
                <div
                  key={field.id}
                  className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex-1 space-y-2">
                    {/* Item type selector */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-0.5">Tipo</label>
                      <select
                        {...register(`details.${index}.itemType`)}
                        onChange={(e) => {
                          const newType = e.target.value as "service" | "product";
                          setValue(`details.${index}.itemType`, newType);
                          setValue(`details.${index}.serviceId`, null);
                          setValue(`details.${index}.productId`, null);
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                      >
                        <option value="service">Servicio</option>
                        <option value="product">Producto</option>
                      </select>
                    </div>

                    {/* Conditional service or product select */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-0.5">
                        {itemType === "service" ? "Servicio" : "Producto"}
                      </label>
                      {itemType === "service" ? (
                        <Controller
                          control={control}
                          name={`details.${index}.serviceId`}
                          render={({ field: f }) => (
                            <ServiceSelect
                              value={f.value ?? null}
                              onChange={(val) => f.onChange(val)}
                              error={detailErrors?.serviceId?.message}
                            />
                          )}
                        />
                      ) : (
                        <Controller
                          control={control}
                          name={`details.${index}.productId`}
                          render={({ field: f }) => (
                            <ProductSelect
                              value={f.value ?? null}
                              onChange={(val) => f.onChange(val)}
                              error={detailErrors?.productId?.message}
                            />
                          )}
                        />
                      )}
                    </div>

                    {/* Quantity */}
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
                        <p className="mt-0.5 text-xs text-red-600">
                          {detailErrors.quantity.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-1 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      aria-label="Eliminar item"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              );
            })}
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
            {isSubmitting ? "Creando..." : "Crear Orden"}
          </button>
        </div>
      </form>
    </Drawer>
  );
}
