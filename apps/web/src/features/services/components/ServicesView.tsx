import { useState } from "react";
import { Search } from "lucide-react";
import { CreateButton } from "@/components/CreateButton";
import { PageView } from "@/components/PageView";
import type { PublicService, ServiceToCreateType, ServiceToUpdateType } from "@car-wash/types";
import { useServices, useServicesMutations } from "../hooks/useServices";
import { ServiceCardGrid } from "./ServiceCardGrid";
import { ServiceSkeletonGrid } from "./ServiceSkeletonGrid";
import { ServiceForm } from "./ServiceForm";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

type ModalState = {
  serviceForm: boolean;
  deleteConfirm: boolean;
};

export function ServicesView() {
  const { services, meta, isLoading, filters, filterActions } = useServices();
  const { create, update, remove, toggleStatus, isCreating, isUpdating, isDeleting, isToggling } =
    useServicesMutations();

  const [modalState, setModalState] = useState<ModalState>({
    serviceForm: false,
    deleteConfirm: false,
  });

  const [editingService, setEditingService] = useState<PublicService | null>(null);
  const [deletingService, setDeletingService] = useState<PublicService | null>(null);

  const handleAddService = () => {
    setEditingService(null);
    setModalState((prev) => ({ ...prev, serviceForm: true }));
  };

  const handleEditService = (service: PublicService) => {
    setEditingService(service);
    setModalState((prev) => ({ ...prev, serviceForm: true }));
  };

  const handleDeleteClick = (service: PublicService) => {
    setDeletingService(service);
    setModalState((prev) => ({ ...prev, deleteConfirm: true }));
  };

  const handleToggle = (service: PublicService) => {
    toggleStatus({ id: service.id, currentStatus: service.status });
  };

  const handleServiceSubmit = (values: ServiceToCreateType) => {
    if (editingService) {
      update({ id: editingService.id, payload: values as ServiceToUpdateType });
    } else {
      create(values as ServiceToCreateType);
    }
    setModalState((prev) => ({ ...prev, serviceForm: false }));
    setEditingService(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingService) {
      remove(deletingService.id);
    }
    setModalState((prev) => ({ ...prev, deleteConfirm: false }));
    setDeletingService(null);
  };

  return (
    <PageView
      title="Gestion de Servicios"
      subtitle="Administra los servicios de tu autolavado."
      action={<CreateButton title="Crear Servicio" onClick={handleAddService} />}
    >

      {/* Search / Filter bar */}
      <div className="flex gap-3 items-center mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={filters.search}
            onChange={(e) => filterActions.setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) =>
            filterActions.setStatus(e.target.value as "all" | "true" | "false")
          }
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="all">Todos</option>
          <option value="true">Disponibles</option>
          <option value="false">No disponibles</option>
        </select>
      </div>

      {/* Card grid area */}
      {isLoading ? (
        <ServiceSkeletonGrid />
      ) : (
        <ServiceCardGrid
          services={services}
          onEdit={handleEditService}
          onDelete={handleDeleteClick}
          onToggle={handleToggle}
          isToggling={isToggling}
          disabled={isCreating || isUpdating || isDeleting}
        />
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Pagina {meta.currentPage} de {meta.totalPages} ({meta.totalRecords} servicios)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={meta.currentPage <= 1}
              onClick={() => filterActions.setPage(meta.currentPage - 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={meta.currentPage >= meta.totalPages}
              onClick={() => filterActions.setPage(meta.currentPage + 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* ServiceForm modal */}
      <ServiceForm
        isOpen={modalState.serviceForm}
        onClose={() => {
          setModalState((prev) => ({ ...prev, serviceForm: false }));
          setEditingService(null);
        }}
        onSubmit={handleServiceSubmit}
        initialData={editingService}
        isSubmitting={isCreating || isUpdating}
      />

      {/* ConfirmationDialog for delete */}
      <ConfirmationDialog
        isOpen={modalState.deleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setModalState((prev) => ({ ...prev, deleteConfirm: false }));
          setDeletingService(null);
        }}
        title="Eliminar servicio"
        message={`¿Estas seguro de que deseas eliminar "${deletingService?.name}"? Esta accion no se puede deshacer.`}
        isLoading={isDeleting}
      />
    </PageView>
  );
}
