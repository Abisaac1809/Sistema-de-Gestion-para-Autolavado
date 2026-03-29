import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceToCreate, type PublicService, type ServiceToCreateType } from "@car-wash/types";
import { Modal } from "@/components/Modal";
import { SaveButton } from "@/components/buttons/SaveButton";
import { CancelButton } from "@/components/buttons/CancelButton";

const ServiceFormSchema = ServiceToCreate.pick({
  name: true,
  description: true,
  price: true,
});

type ServiceFormValues = Pick<ServiceToCreateType, "name" | "description" | "price">;

type ServiceFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ServiceToCreateType) => void;
  initialData: PublicService | null;
  isSubmitting: boolean;
};

export function ServiceForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceFormSchema),
    defaultValues: {
      name: "",
      description: null,
      price: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description ?? null,
          price: initialData.price,
        });
      } else {
        reset({ name: "", description: null, price: 0 });
      }
    }
  }, [isOpen, initialData, reset]);

  const isEditing = !!initialData;
  const title = isEditing ? "Editar servicio" : "Crear servicio";

  const handleFormSubmit = (values: ServiceFormValues) => {
    onSubmit({
      ...values,
      status: initialData ? initialData.status : true,
    } as ServiceToCreateType);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="service-name" className="block text-sm font-medium text-gray-700">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            id="service-name"
            type="text"
            {...register("name")}
            placeholder="Ej: Lavado basico"
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              errors.name ? "border-red-300 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="service-description" className="block text-sm font-medium text-gray-700">
            Descripcion{" "}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            id="service-description"
            {...register("description")}
            placeholder="Descripcion del servicio..."
            rows={3}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none ${
              errors.description ? "border-red-300 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="service-price" className="block text-sm font-medium text-gray-700">
            Precio ($) <span className="text-red-500">*</span>
          </label>
          <input
            id="service-price"
            type="number"
            step="0.01"
            min="0.01"
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              errors.price ? "border-red-300 focus:ring-red-500" : "border-gray-300"
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 mt-5">
          <CancelButton onClick={onClose} />
          <SaveButton
            isSubmitting={isSubmitting}
            label={isEditing ? "Guardar cambios" : "Crear servicio"}
          />
        </div>
      </form>
    </Modal>
  );
}
