import { Pencil, Trash2 } from "lucide-react";
import type { PublicService } from "@car-wash/types";

type ServiceCardProps = {
  service: PublicService;
  onEdit: (service: PublicService) => void;
  onDelete: (service: PublicService) => void;
  onToggle: (service: PublicService) => void;
  isToggling: boolean;
  disabled: boolean;
};

export function ServiceCard({
  service,
  onEdit,
  onDelete,
  onToggle,
  isToggling,
  disabled,
}: ServiceCardProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm p-4 flex flex-col gap-3">
      {/* Top: name + status badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-gray-900 leading-snug">{service.name}</span>
        {service.status ? (
          <span className="inline-block shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Disponible
          </span>
        ) : (
          <span className="inline-block shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            No disponible
          </span>
        )}
      </div>

      {/* Middle: description + price */}
      <div className="flex flex-col gap-1">
        {service.description ? (
          <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">Sin descripcion</p>
        )}
        <p className="text-lg font-bold text-gray-900">
          ${service.price.toFixed(2)}
        </p>
      </div>

      {/* Bottom: actions */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onToggle(service)}
          disabled={isToggling}
          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {service.status ? "Desactivar" : "Activar"}
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(service)}
            disabled={disabled}
            aria-label="Editar servicio"
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(service)}
            disabled={disabled}
            aria-label="Eliminar servicio"
            className="rounded-md p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
