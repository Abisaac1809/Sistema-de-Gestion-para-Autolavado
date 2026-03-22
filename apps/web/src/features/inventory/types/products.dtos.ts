import {
    ProductToCreateType,
    ProductToUpdateType,
    PublicProduct,
    ListOfProducts
} from "@car-wash/types";

export enum IsForSaleFilter {
    All = "all",
    True = "true",
    False = "false",
}

export type ProductFiltersState = {
    search: string;
    categoryId: string | null;
    isForSale: IsForSaleFilter;
    page: number;
    limit: number;
};

export type ProductFiltersActions = {
    setSearch: (value: string) => void;
    setCategoryId: (value: string | null) => void;
    setIsForSale: (value: IsForSaleFilter) => void;
    setPage: (value: number) => void;
};

export type UseProductsResult = {
    products: PublicProduct[];
    meta: ListOfProducts["meta"] | null;
    isLoading: boolean;
    filters: ProductFiltersState;
    filterActions: ProductFiltersActions;
};

export type UseProductResult = {
    product: PublicProduct | null;
    isLoading: boolean;
};

export type UseProductsMutationsResult = {
    create: (payload: ProductToCreateType) => void;
    update: (args: { id: string; payload: ProductToUpdateType }) => void;
    remove: (id: string) => void;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
};
