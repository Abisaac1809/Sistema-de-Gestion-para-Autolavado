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
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import {
  ProductFiltersState,
  ProductFiltersActions,
  IsForSaleFilter,
  UseProductsResult,
  UseProductResult,
  UseProductsMutationsResult,
} from "../types/products.dtos";

function useProductFilters() {
  const [search, setSearchState] = useState<string>("");
  const [categoryId, setCategoryIdState] = useState<string | null>(null);
  const [isForSale, setIsForSaleState] = useState<IsForSaleFilter>(IsForSaleFilter.All);
  const [page, setPageState] = useState<number>(1);
  const limit = 10;

  const filters: ProductFiltersState = { search, categoryId, isForSale, page, limit };

  const filterActions: ProductFiltersActions = {
    setSearch: (value) => { setSearchState(value); setPageState(1); },
    setCategoryId: (value) => { setCategoryIdState(value); setPageState(1); },
    setIsForSale: (value) => { setIsForSaleState(value); setPageState(1); },
    setPage: setPageState,
  };

  return { filters, filterActions };
}

export function useProducts(): UseProductsResult {
  const { filters, filterActions } = useProductFilters();

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
    filters,
    filterActions,
  };
}

export function useProduct(id: string | null): UseProductResult {
  const query = useQuery({
    queryKey: ["inventory", "products", id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  return {
    product: query.data ?? null,
    isLoading: query.isLoading,
  };
}

export function useProductsMutations(): UseProductsMutationsResult {
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

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
