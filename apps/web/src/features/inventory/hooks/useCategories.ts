import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { PublicCategory, CategoryToCreateType, CategoryFiltersType, CategoryToUpdateType, ListOfCategories } from "@car-wash/types";
import { getCategories, createCategory, editCategory, deleteCategory } from "../services/categoryService";

export type UseCategoriesResult = {
  categories: PublicCategory[];
  meta: ListOfCategories["meta"] | null;
  isLoading: boolean;
  isCreating: boolean;
  create: (payload: CategoryToCreateType) => void;
  update: (args: { id: string; payload: CategoryToUpdateType }) => void;
  remove: (id: string) => void;
};

function useCategoryFilters() {
  const [search, setSearchState] = useState<string>("");
  const [page, setPageState] = useState<number>(1);
  const limit = 10;

  const filters = { search, page, limit };

  const actions = {
    setSearch: (valor: string) => {setSearchState(valor); setPageState(1);},
    setPage: (valor: number) => setPageState(valor)
  }

  return { filters, actions };
}

function useCategoryMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({queryKey: ["inventory", "categories"]});
  }

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { invalidate(); toast.success("Categoría creada correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const updateMutation = useMutation({
    mutationFn: ({id, payload}: {id: string; payload: CategoryToUpdateType}) => editCategory(id, payload),
    onSuccess: () => { invalidate(); toast.success("Categoría actualizada correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => { invalidate(); toast.success("Categoría eliminada"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation
  }
}

function useCategoryQuery(filters: CategoryFiltersType) {
  return useQuery({
    queryKey: ["inventory", "categories", filters],
    queryFn: () => {
      const params: CategoryFiltersType = {page: filters.page, limit: filters.limit};

      if (filters.search != "") params.search = filters.search;

      return getCategories(params);
    },
  });
}

export function useCategories(): UseCategoriesResult {
  const { filters, actions } = useCategoryFilters();
  const { createMutation, updateMutation, deleteMutation } = useCategoryMutations();
  const query = useCategoryQuery(filters);

  return {
    categories: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isCreating: createMutation.isPending,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
