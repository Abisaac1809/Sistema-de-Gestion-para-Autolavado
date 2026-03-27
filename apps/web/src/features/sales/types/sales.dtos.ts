import type {
  PublicSale,
  ListOfSales,
  SaleToCreateType,
  SaleStatus,
  RevenueKpis,
  PaymentMethodBreakdownItem,
} from "@car-wash/types";

export type { SaleToCreateType };

export type SaleFiltersState = {
  search: string;
  status: "" | "COMPLETED" | "REFUNDED" | "CANCELLED";
  fromDate: string;
  toDate: string;
  paymentMethodId: string;
  page: number;
  limit: number;
};

export type SaleFiltersActions = {
  setSearch: (value: string) => void;
  setStatus: (value: SaleFiltersState["status"]) => void;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  setPaymentMethodId: (value: string) => void;
  setPage: (value: number) => void;
  resetFilters: () => void;
};

export type UseSalesResult = {
  sales: PublicSale[];
  meta: ListOfSales["meta"] | null;
  isLoading: boolean;
  filters: SaleFiltersState;
  filterActions: SaleFiltersActions;
};

export type SaleMutateOptions = {
  onSuccess?: () => void;
};

export type UseSalesMutationsResult = {
  create: (payload: SaleToCreateType, options?: SaleMutateOptions) => void;
  updateStatus: (payload: { id: string; status: SaleStatus }) => void;
  isCreating: boolean;
  isUpdatingStatus: boolean;
};

export type UseSalesKpisResult = {
  revenue: RevenueKpis | null;
  breakdown: PaymentMethodBreakdownItem[];
  isLoading: boolean;
};
