import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  PublicProduct,
  ListOfProducts,
  ProductToCreateType,
  ProductToUpdateType,
} from "@car-wash/types";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

type ProductFiltersState = {
  search: string;
  categoryId: string | null;
  isForSale: "all" | "true" | "false";
  page: number;
  limit: number;
};

export type UseProductsResult = {
  products: PublicProduct[];
  meta: ListOfProducts["meta"] | null;
  isLoading: boolean;
  filters: ProductFiltersState;
  setSearch: (search: string) => void;
  setCategoryId: (categoryId: string | null) => void;
  setIsForSale: (value: "all" | "true" | "false") => void;
  setPage: (page: number) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  create: (payload: ProductToCreateType) => void;
  update: (args: { id: string; payload: ProductToUpdateType }) => void;
  remove: (id: string) => void;
};

export function useProducts(): UseProductsResult {
  const queryClient = useQueryClient();

  const [search, setSearchState] = useState<string>("");
  const [categoryId, setCategoryIdState] = useState<string | null>(null);
  const [isForSale, setIsForSaleState] = useState<"all" | "true" | "false">("all");
  const [page, setPageState] = useState<number>(1);
  const limit = 10;

  const filters: ProductFiltersState = { search, categoryId, isForSale, page, limit };

  const query = useQuery({
    queryKey: ["inventory", "products", { search, categoryId, isForSale, page, limit }],
    queryFn: () => {
      const params: {
        search?: string;
        categoryId?: string;
        isForSale?: boolean;
        page: number;
        limit: number;
      } = { page, limit };

      if (search !== "") params.search = search;
      if (categoryId !== null) params.categoryId = categoryId;
      if (isForSale === "true") params.isForSale = true;
      if (isForSale === "false") params.isForSale = false;

      return getProducts(params);
    },
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductToUpdateType }) =>
      updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "products"] });
    },
  });

  function setSearch(value: string): void {
    setSearchState(value);
    setPageState(1);
  }

  function setCategoryId(value: string | null): void {
    setCategoryIdState(value);
    setPageState(1);
  }

  function setIsForSale(value: "all" | "true" | "false"): void {
    setIsForSaleState(value);
    setPageState(1);
  }

  function setPage(value: number): void {
    setPageState(value);
  }

  return {
    products: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    filters,
    setSearch,
    setCategoryId,
    setIsForSale,
    setPage,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
}
