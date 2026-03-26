import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type {
  ServiceToUpdateType,
  ServiceFiltersType,
} from "@car-wash/types";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../services/serviceService";
import type {
  ServiceFiltersState,
  ServiceFiltersActions,
  UseServicesResult,
  UseServicesMutationsResult,
} from "../types/services.dtos";
import { type StatusFilter } from "../types/services.dtos";

function useServiceFilters() {
  const [search, setSearchState] = useState<string>("");
  const [status, setStatusState] = useState<StatusFilter>("all");
  const [page, setPageState] = useState<number>(1);
  const limit = 20;

  const filters: ServiceFiltersState = { search, status, page, limit };

  const filterActions: ServiceFiltersActions = {
    setSearch: (value) => { setSearchState(value); setPageState(1); },
    setStatus: (value) => { setStatusState(value); setPageState(1); },
    setPage: setPageState,
  };

  return { filters, filterActions };
}

export function useServices(): UseServicesResult {
  const { filters, filterActions } = useServiceFilters();

  const query = useQuery({
    queryKey: ["services", filters],
    queryFn: () => {
      const params: ServiceFiltersType = { page: filters.page, limit: filters.limit };

      if (filters.search !== "") params.search = filters.search;
      if (filters.status === "true") params.status = true;
      if (filters.status === "false") params.status = false;

      return getServices(params);
    },
  });

  return {
    services: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    filters,
    filterActions,
  };
}

export function useServicesMutations(): UseServicesMutationsResult {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["services"] });

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => { invalidate(); toast.success("Servicio creado correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ServiceToUpdateType }) =>
      updateService(id, payload),
    onSuccess: () => { invalidate(); toast.success("Servicio actualizado correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => { invalidate(); toast.success("Servicio eliminado"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: boolean }) =>
      updateService(id, { status: !currentStatus }),
    onSuccess: () => { invalidate(); toast.success("Disponibilidad actualizada"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    toggleStatus: toggleMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleMutation.isPending,
  };
}
