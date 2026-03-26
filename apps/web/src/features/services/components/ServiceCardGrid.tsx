import type { PublicService } from "@car-wash/types";
import { ServiceCard } from "./ServiceCard";

type ServiceCardGridProps = {
  services: PublicService[];
  onEdit: (service: PublicService) => void;
  onDelete: (service: PublicService) => void;
  onToggle: (service: PublicService) => void;
  isToggling: boolean;
  disabled: boolean;
};

export function ServiceCardGrid({
  services,
  onEdit,
  onDelete,
  onToggle,
  isToggling,
  disabled,
}: ServiceCardGridProps) {
  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">No se encontraron servicios</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          isToggling={isToggling}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
