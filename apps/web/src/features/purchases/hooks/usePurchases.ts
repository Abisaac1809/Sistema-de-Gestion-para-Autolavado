import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { PurchaseFiltersType } from "@car-wash/types";
import {
  getPurchases,
  getPurchase,
  createPurchase,
  deletePurchase,
} from "../services/purchaseService";
import type {
  PurchaseFiltersState,
  PurchaseFiltersActions,
  UsePurchasesResult,
  UsePurchasesMutationsResult,
} from "../types/purchases.dtos";

function usePurchaseFilters() {
  const [search, setSearchState] = useState<string>("");
  const [paymentMethodId, setPaymentMethodIdState] = useState<string>("");
  const [fromDate, setFromDateState] = useState<string>("");
  const [toDate, setToDateState] = useState<string>("");
  const [page, setPageState] = useState<number>(1);
  const limit = 10;

  const filters: PurchaseFiltersState = {
    search,
    paymentMethodId,
    fromDate,
    toDate,
    page,
    limit,
  };

  const filterActions: PurchaseFiltersActions = {
    setSearch: (value) => { setSearchState(value); setPageState(1); },
    setPaymentMethodId: (value) => { setPaymentMethodIdState(value); setPageState(1); },
    setFromDate: (value) => { setFromDateState(value); setPageState(1); },
    setToDate: (value) => { setToDateState(value); setPageState(1); },
    setPage: setPageState,
    resetFilters: () => {
      setSearchState("");
      setPaymentMethodIdState("");
      setFromDateState("");
      setToDateState("");
      setPageState(1);
    },
  };

  return { filters, filterActions };
}

export function usePurchases(): UsePurchasesResult {
  const { filters, filterActions } = usePurchaseFilters();

  const query = useQuery({
    queryKey: ["purchases", filters],
    queryFn: () => {
      const params: PurchaseFiltersType = { page: filters.page, limit: filters.limit };

      if (filters.search !== "") params.search = filters.search;
      if (filters.paymentMethodId !== "") params.paymentMethodId = filters.paymentMethodId;
      if (filters.fromDate !== "") params.fromDate = filters.fromDate;
      if (filters.toDate !== "") params.toDate = filters.toDate;

      return getPurchases(params);
    },
  });

  return {
    purchases: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    filters,
    filterActions,
  };
}

export function usePurchase(id: string) {
  return useQuery({
    queryKey: ["purchases", id],
    queryFn: () => getPurchase(id),
    enabled: !!id,
  });
}

export function usePurchasesMutations(): UsePurchasesMutationsResult {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["purchases"] });

  const mutationCallbacks = (successMessage: string) => ({
    onSuccess: () => {
      invalidate();
      toast.success(successMessage);
    },
    onError: (error: unknown) => {
      if (!isAxiosError(error)) {
        toast.error("Ocurrió un error inesperado");
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: createPurchase,
    ...mutationCallbacks("Compra registrada correctamente"),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePurchase,
    ...mutationCallbacks("Compra eliminada"),
  });

  return {
    create: createMutation.mutate,
    remove: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
