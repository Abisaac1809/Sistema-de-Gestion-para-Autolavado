import { useEffect, useState } from "react";
import type { PublicNotificationContact } from "@car-wash/types";
import { Modal } from "../../../components/Modal";
import {
  NotificationContactFormSchema,
  type NotificationContactFormValues,
} from "../schemas/settings.schemas";

type NotificationContactFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NotificationContactFormValues) => void;
  initialData?: PublicNotificationContact | null;
  isSubmitting: boolean;
};

type FieldErrors = {
  fullName?: string;
  email?: string;
};

export function NotificationContactForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: NotificationContactFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [receiveReports, setReceiveReports] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Populate form when opening in edit mode or reset in create mode
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFullName(initialData.fullName ?? "");
        setEmail(initialData.email);
        setReceiveReports(initialData.receiveReports);
        setIsActive(initialData.isActive);
      } else {
        setFullName("");
        setEmail("");
        setReceiveReports(true);
        setIsActive(true);
      }
      setFieldErrors({});
    }
  }, [isOpen, initialData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFieldErrors({});
    }
  }, [isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const values = {
      fullName: fullName.trim() || null,
      email: email.trim(),
      receiveReports,
      isActive,
    };

    const result = NotificationContactFormSchema.safeParse(values);

    if (!result.success) {
      const errors: FieldErrors = {};
      const issues = result.error.issues;
      for (const issue of issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (field === "fullName" || field === "email") {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    onSubmit(result.data as NotificationContactFormValues);
  }

  const isEditing = !!initialData;
  const title = isEditing ? "Editar contacto" : "Agregar contacto";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Full name */}
        <div>
          <label
            htmlFor="contact-fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre completo{" "}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            id="contact-fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ej: Juan Perez"
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              fieldErrors.fullName
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {fieldErrors.fullName && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-gray-700"
          >
            Correo electronico{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              fieldErrors.email
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-1">
          {/* receiveReports toggle */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="contact-receiveReports"
              className="text-sm font-medium text-gray-700"
            >
              Recibir reportes
            </label>
            <button
              id="contact-receiveReports"
              type="button"
              role="switch"
              aria-checked={receiveReports}
              onClick={() => setReceiveReports((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 ${
                receiveReports ? "bg-gray-900" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform ${
                  receiveReports ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* isActive toggle */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="contact-isActive"
              className="text-sm font-medium text-gray-700"
            >
              Activo
            </label>
            <button
              id="contact-isActive"
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 ${
                isActive ? "bg-gray-900" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform ${
                  isActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
