import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { SaleFiltersType, SaleStatus } from "@car-wash/types";
import {
  getSales,
  getSale,
  createSale,
  updateSaleStatus,
} from "../services/saleService";
import type {
  SaleFiltersState,
  SaleFiltersActions,
  UseSalesResult,
  UseSalesMutationsResult,
  SaleToCreateType,
  SaleMutateOptions,
} from "../types/sales.dtos";

function useSaleFilters() {
  const [search, setSearchState] = useState<string>("");
  const [status, setStatusState] = useState<SaleFiltersState["status"]>("");
  const [fromDate, setFromDateState] = useState<string>("");
  const [toDate, setToDateState] = useState<string>("");
  const [paymentMethodId, setPaymentMethodIdState] = useState<string>("");
  const [page, setPageState] = useState<number>(1);
  const limit = 10;

  const filters: SaleFiltersState = {
    search,
    status,
    fromDate,
    toDate,
    paymentMethodId,
    page,
    limit,
  };

  const filterActions: SaleFiltersActions = {
    setSearch: (value) => { setSearchState(value); setPageState(1); },
    setStatus: (value) => { setStatusState(value); setPageState(1); },
    setFromDate: (value) => { setFromDateState(value); setPageState(1); },
    setToDate: (value) => { setToDateState(value); setPageState(1); },
    setPaymentMethodId: (value) => { setPaymentMethodIdState(value); setPageState(1); },
    setPage: setPageState,
    resetFilters: () => {
      setSearchState("");
      setStatusState("");
      setFromDateState("");
      setToDateState("");
      setPaymentMethodIdState("");
      setPageState(1);
    },
  };

  return { filters, filterActions };
}

export function useSales(): UseSalesResult {
  const { filters, filterActions } = useSaleFilters();

  const query = useQuery({
    queryKey: ["sales", filters],
    queryFn: () => {
      // paymentMethodId is client-side only — never sent to backend
      const { paymentMethodId, ...filtersForApi } = filters;
      void paymentMethodId;

      const params: SaleFiltersType = { page: filtersForApi.page, limit: filtersForApi.limit };

      if (filtersForApi.search !== "") params.search = filtersForApi.search;
      if (filtersForApi.status !== "") params.status = filtersForApi.status as SaleStatus;
      if (filtersForApi.fromDate !== "") params.fromDate = new Date(filtersForApi.fromDate);
      if (filtersForApi.toDate !== "") params.toDate = new Date(filtersForApi.toDate);

      return getSales(params);
    },
  });

  return {
    sales: query.data?.data ?? [],
    meta: query.data?.meta ?? null,
    isLoading: query.isLoading,
    filters,
    filterActions,
  };
}

export function useSale(id: string | null) {
  return useQuery({
    queryKey: ["sales", id],
    queryFn: () => getSale(id!),
    enabled: !!id,
  });
}

export function useSalesMutations(): UseSalesMutationsResult {
  const queryClient = useQueryClient();

  const mutationCallbacks = (successMessage: string) => ({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success(successMessage);
    },
    onError: (error: unknown) => {
      if (!isAxiosError(error)) {
        toast.error("Ocurrió un error inesperado");
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: SaleToCreateType) => createSale(payload),
    ...mutationCallbacks("Venta creada correctamente"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SaleStatus }) =>
      updateSaleStatus(id, status),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["sales", variables.id] });
      void queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success("Estado actualizado");
    },
    onError: (error: unknown) => {
      if (!isAxiosError(error)) {
        toast.error("Ocurrió un error inesperado");
      }
    },
  });

  return {
    create: (payload: SaleToCreateType, options?: SaleMutateOptions) =>
      createMutation.mutate(payload, { onSuccess: options?.onSuccess }),
    updateStatus: updateStatusMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}
