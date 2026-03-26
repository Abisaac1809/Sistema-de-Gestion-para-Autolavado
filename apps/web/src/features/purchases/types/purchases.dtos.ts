import type {
  PublicPurchase,
  ListOfPurchases,
  PurchaseToCreateType,
} from "@car-wash/types";

export type { PurchaseToCreateType };

export type PurchaseFiltersState = {
  search: string;
  paymentMethodId: string;
  fromDate: string;
  toDate: string;
  page: number;
  limit: number;
};

export type PurchaseFiltersActions = {
  setSearch: (value: string) => void;
  setPaymentMethodId: (value: string) => void;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  setPage: (value: number) => void;
  resetFilters: () => void;
};

export type UsePurchasesResult = {
  purchases: PublicPurchase[];
  meta: ListOfPurchases["meta"] | null;
  isLoading: boolean;
  filters: PurchaseFiltersState;
  filterActions: PurchaseFiltersActions;
};

export type UsePurchasesMutationsResult = {
  create: (payload: PurchaseToCreateType) => void;
  remove: (id: string) => void;
  isCreating: boolean;
  isDeleting: boolean;
};
