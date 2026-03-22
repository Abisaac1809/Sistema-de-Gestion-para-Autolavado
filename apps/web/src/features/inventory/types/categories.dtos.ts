import {
  PublicCategory,
  ListOfCategories,
  CategoryToCreateType,
  CategoryToUpdateType,
} from "@car-wash/types";

// ─── Filter state ─────────────────────────────────────────────────────────────
export type CategoryFiltersState = {
  search: string;
  page: number;
  limit: number;
};

// ─── Filter actions ───────────────────────────────────────────────────────────
export type CategoryFiltersActions = {
  setSearch: (value: string) => void;
  setPage: (value: number) => void;
};

// ─── Hook result types ────────────────────────────────────────────────────────

export type UseCategoriesResult = {
  categories: PublicCategory[];
  meta: ListOfCategories["meta"] | null;
  isLoading: boolean;
  filters: CategoryFiltersState;
  filterActions: CategoryFiltersActions;
};

export type UseCategoryResult = {
  category: PublicCategory | null;
  isLoading: boolean;
};

export type UseCategoriesMutationsResult = {
  create: (payload: CategoryToCreateType) => void;
  update: (args: { id: string; payload: CategoryToUpdateType }) => void;
  remove: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
};
