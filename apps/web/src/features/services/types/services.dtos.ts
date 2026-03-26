import type {
  PublicService,
  ListOfServices,
  ServiceToCreateType,
  ServiceToUpdateType,
} from "@car-wash/types";

export type { ServiceToCreateType, ServiceToUpdateType };

export type StatusFilter = "all" | "true" | "false";

export type ServiceFiltersState = {
  search: string;
  status: StatusFilter;
  page: number;
  limit: number;
};

export type ServiceFiltersActions = {
  setSearch: (value: string) => void;
  setStatus: (value: StatusFilter) => void;
  setPage: (value: number) => void;
};

export type UseServicesResult = {
  services: PublicService[];
  meta: ListOfServices["meta"] | null;
  isLoading: boolean;
  filters: ServiceFiltersState;
  filterActions: ServiceFiltersActions;
};

export type UseServicesMutationsResult = {
  create: (payload: ServiceToCreateType) => void;
  update: (args: { id: string; payload: ServiceToUpdateType }) => void;
  remove: (id: string) => void;
  toggleStatus: (args: { id: string; currentStatus: boolean }) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isToggling: boolean;
};
