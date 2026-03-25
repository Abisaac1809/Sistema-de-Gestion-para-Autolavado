import { Mail, Pencil, Trash2 } from "lucide-react";
import type { PublicNotificationContact } from "@car-wash/types";

type ContactListItemProps = {
  contact: PublicNotificationContact;
  onEdit: (contact: PublicNotificationContact) => void;
  onDeleteRequest: (id: string) => void;
  disabled: boolean;
};

export function ContactListItem({
  contact,
  onEdit,
  onDeleteRequest,
  disabled,
}: ContactListItemProps) {
  const displayName = contact.fullName?.trim() || "Sin nombre";

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
      {/* Contact info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
          <p className="text-xs text-gray-500 truncate">{contact.email}</p>
        </div>
      </div>

      {/* Badges + actions */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            contact.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {contact.isActive ? "Activo" : "Inactivo"}
        </span>

        {contact.receiveReports && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            <Mail className="h-3 w-3" />
            Reportes
          </span>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(contact)}
            disabled={disabled}
            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Editar ${contact.fullName ?? contact.email}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteRequest(contact.id)}
            disabled={disabled}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Eliminar ${contact.fullName ?? contact.email}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
