import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type {
  ProductToUpdateType,
  ProductFiltersType,
} from "@car-wash/types";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import {
  ProductFiltersState,
  ProductFiltersActions,
  IsForSaleFilter,
  UseProductsResult,
  UseProductFiltersReturn,
  UseProductsMutationsReturn,
} from "../types/products.dtos";

function useProductFilters(): UseProductFiltersReturn {
  const [search, setSearchState] = useState<string>("");
  const [categoryId, setCategoryIdState] = useState<string | null>(null);
  const [isForSale, setIsForSaleState] = useState<IsForSaleFilter>(IsForSaleFilter.All);
  const [page, setPageState] = useState<number>(1);
  const limit = 10;

  const filters: ProductFiltersState = { search, categoryId, isForSale, page, limit };

  const actions: ProductFiltersActions = {
    setSearch: (value) => { setSearchState(value); setPageState(1); },
    setCategoryId: (value) => { setCategoryIdState(value); setPageState(1); },
    setIsForSale: (value) => { setIsForSaleState(value); setPageState(1); },
    setPage: setPageState,
  };

  return { filters, actions };
}

function useProductsMutations(): UseProductsMutationsReturn {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { invalidate(); toast.success("Producto creado correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductToUpdateType }) =>
      updateProduct(id, payload),
    onSuccess: () => { invalidate(); toast.success("Producto actualizado correctamente"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { invalidate(); toast.success("Producto eliminado"); },
    onError: (error: unknown) => { if (!isAxiosError(error)) toast.error("Ocurrió un error inesperado"); },
  });

  return { createMutation, updateMutation, deleteMutation };
}

export function useProducts(): UseProductsResult {
  const { filters, actions } = useProductFilters();
  const { createMutation, updateMutation, deleteMutation } = useProductsMutations();

  const query = useQuery({
    queryKey: ["inventory", "products", filters],
    queryFn: () => {
      const params: ProductFiltersType = { page: filters.page, limit: filters.limit };

      if (filters.search !== "") params.search = filters.search;
      if (filters.categoryId !== null) params.categoryId = filters.categoryId ?? undefined;
      if (filters.isForSale === "true") params.isForSale = true;
      if (filters.isForSale === "false") params.isForSale = false;

      return getProducts(params);
    },
  });

  return {
    products: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    filters,
    filterActions: actions,
    mutations: {
      create: createMutation.mutate,
      update: updateMutation.mutate,
      remove: deleteMutation.mutate,
    },
  };
}
