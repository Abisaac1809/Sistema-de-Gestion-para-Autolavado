import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { CategoryToUpdateType, CategoryFiltersType } from "@car-wash/types";
import {
  getCategories,
  getCategory,
  createCategory,
  editCategory,
  deleteCategory,
} from "../services/categoryService";
import {
  CategoryFiltersState,
  CategoryFiltersActions,
  UseCategoriesResult,
  UseCategoryResult,
  UseCategoriesMutationsResult,
} from "../types/categories.dtos";

// ─── Private: filter state ────────────────────────────────────────────────────
// NOT exported. Only used by useCategories.
function useCategoryFilters() {
  const [search, setSearchState] = useState<string>("");
  const [page, setPageState] = useState<number>(1);
  const limit = 10;

  const filters: CategoryFiltersState = { search, page, limit };

  const filterActions: CategoryFiltersActions = {
    setSearch: (value) => { setSearchState(value); setPageState(1); },
    setPage: setPageState,
  };

  return { filters, filterActions };
}

// ─── Hook 1: list + filters ───────────────────────────────────────────────────
export function useCategories(): UseCategoriesResult {
  const { filters, filterActions } = useCategoryFilters();

  const query = useQuery({
    queryKey: ["inventory", "categories", filters],
    queryFn: () => {
      const params: CategoryFiltersType = { page: filters.page, limit: filters.limit };

      if (filters.search !== "") params.search = filters.search;

      return getCategories(params);
    },
  });

  return {
    categories: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    filters,
    filterActions,
  };
}

// ─── Hook 2: single item ──────────────────────────────────────────────────────
export function useCategory(id: string | null): UseCategoryResult {
  const query = useQuery({
    queryKey: ["inventory", "categories", id],
    queryFn: () => getCategory(id!),
    enabled: !!id,
  });

  return {
    category: query.data ?? null,
    isLoading: query.isLoading,
  };
}

// ─── Hook 3: mutations ────────────────────────────────────────────────────────
export function useCategoriesMutations(): UseCategoriesMutationsResult {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["inventory", "categories"] });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { invalidate(); toast.success("Categoría creada correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryToUpdateType }) =>
      editCategory(id, payload),
    onSuccess: () => { invalidate(); toast.success("Categoría actualizada correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => { invalidate(); toast.success("Categoría eliminada"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
