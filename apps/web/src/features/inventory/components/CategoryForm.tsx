import { useEffect, useState } from "react";
import { CategoryToCreate, type CategoryToCreateType } from "@car-wash/types";
import { Modal } from "@/components/Modal";
import { SaveButton } from "@/components/buttons/SaveButton";
import { CancelButton } from "@/components/buttons/CancelButton";

type CategoryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryToCreateType) => void;
  isSubmitting: boolean;
};

type FormErrors = Record<string, string>;

export function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Reset fields when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setErrors({});
    }
  }, [isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = CategoryToCreate.safeParse({
      name,
      description: description || undefined,
    });

    if (!result.success) {
      const newErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!newErrors[key]) newErrors[key] = issue.message;
      }
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  const inputBase =
    "rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 w-full";
  const inputNormal = `${inputBase} border-gray-200`;
  const inputError = `${inputBase} border-red-500`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear categoria" size="sm">
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">

        {/* Name */}
        <div>
          <label
            htmlFor="category-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Productos de limpieza"
            className={errors.name ? inputError : inputNormal}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="category-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripcion{" "}
            <span className="text-gray-400 font-normal text-xs">(opcional)</span>
          </label>
          <textarea
            id="category-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe brevemente la categoria..."
            rows={3}
            className={errors.description ? inputError : inputNormal}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
          <CancelButton onClick={onClose} />
          <SaveButton isSubmitting={isSubmitting} />
        </div>
      </form>
    </Modal>
  );
}
