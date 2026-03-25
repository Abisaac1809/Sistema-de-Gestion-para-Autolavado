import { useState } from "react";
import { Plus } from "lucide-react";
import type { PublicNotificationContact } from "@car-wash/types";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { NotificationContactForm } from "../../NotificationContactForm";
import type { NotificationContactFormValues } from "../../../schemas/settings.schemas";
import { useNotificationContacts, useNotificationContactsMutations } from "../../../hooks/useNotificationContacts";
import { EmptyContactState } from "./EmptyContactState";
import { ContactListItem } from "./ContactListItem";
import SkeletonLoading from "./SkeletonLoading";

export function NotificationContactsTab() {
  const { contacts, isLoading } = useNotificationContacts();
  const { create, update, remove, isCreating, isUpdating, isDeleting } = useNotificationContactsMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<PublicNotificationContact | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const isMutating = isCreating || isUpdating || isDeleting;

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
      update({ id: editingContact.id, payload: values });
    } else {
      create(values);
    }
    handleCloseModal();
  }

  function handleConfirmDelete() {
    if (!confirmDeleteId) return;
    remove(confirmDeleteId);
    setConfirmDeleteId(null);
  }

  if (isLoading) <SkeletonLoading/>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Contactos de notificacion</h2>
        <button
          type="button"
          onClick={() => { setEditingContact(null); setIsModalOpen(true); }}
          disabled={isMutating}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar contacto
        </button>
      </div>

      {contacts.length === 0 ? (
        <EmptyContactState />
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <ContactListItem
              key={contact.id}
              contact={contact}
              onEdit={handleOpenEdit}
              onDeleteRequest={setConfirmDeleteId}
              disabled={isMutating}
            />
          ))}
        </div>
      )}

      <NotificationContactForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingContact}
        isSubmitting={isCreating || isUpdating}
      />

      <ConfirmationDialog
        isOpen={confirmDeleteId !== null}
        title="Eliminar contacto"
        message="¿Estás seguro de que deseas eliminar este contacto?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
