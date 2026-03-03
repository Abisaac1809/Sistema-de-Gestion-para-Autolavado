import { useState } from "react";
import { Plus, Pencil, Trash2, Mail } from "lucide-react";
import type {
  PublicNotificationContact,
  NotificationContactToCreateType,
  NotificationContactToUpdateType,
} from "@car-wash/types";
import { NotificationContactForm } from "../NotificationContactForm";
import type { NotificationContactFormValues } from "../../schemas/settings.schemas";

type NotificationContactsTabProps = {
  contacts: PublicNotificationContact[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onCreate: (payload: NotificationContactToCreateType) => void;
  onUpdate: (args: { id: string; payload: NotificationContactToUpdateType }) => void;
  onDelete: (id: string) => void;
};

export function NotificationContactsTab({
  contacts,
  isLoading,
  isCreating,
  isUpdating,
  isDeleting,
  onCreate,
  onUpdate,
  onDelete,
}: NotificationContactsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<PublicNotificationContact | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const isMutating = isCreating || isUpdating || isDeleting;

  function handleOpenCreate() {
    setEditingContact(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(contact: PublicNotificationContact) {
    setEditingContact(contact);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingContact(null);
  }

  function handleFormSubmit(values: NotificationContactFormValues) {
    if (editingContact) {
      onUpdate({ id: editingContact.id, payload: values });
    } else {
      onCreate(values);
    }
    handleCloseModal();
  }

  function handleConfirmDelete(id: string) {
    onDelete(id);
    setConfirmDeleteId(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-9 w-36 bg-gray-200 rounded-md" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Contactos de notificacion
        </h2>
        <button
          type="button"
          onClick={handleOpenCreate}
          disabled={isMutating}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar contacto
        </button>
      </div>

      {/* Empty state */}
      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <Mail className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700">
            No hay contactos de notificacion configurados.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Agrega tu primer contacto usando el boton de arriba.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              {/* Contact info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contact.fullName && contact.fullName.trim()
                      ? contact.fullName
                      : "Sin nombre"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                </div>
              </div>

              {/* Badges + actions */}
              <div className="flex items-center gap-3 shrink-0 ml-4">
                {/* Status badge */}
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    contact.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {contact.isActive ? "Activo" : "Inactivo"}
                </span>

                {/* Receive reports badge */}
                {contact.receiveReports && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    <Mail className="h-3 w-3" />
                    Reportes
                  </span>
                )}

                {/* Delete confirmation or actions */}
                {confirmDeleteId === contact.id ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">¿Eliminar?</span>
                    <button
                      type="button"
                      onClick={() => handleConfirmDelete(contact.id)}
                      disabled={isDeleting}
                      className="font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      Si
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="font-medium text-gray-500 hover:text-gray-700"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(contact)}
                      disabled={isMutating}
                      className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Editar ${contact.fullName ?? contact.email}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(contact.id)}
                      disabled={isMutating}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Eliminar ${contact.fullName ?? contact.email}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal form */}
      <NotificationContactForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingContact}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
