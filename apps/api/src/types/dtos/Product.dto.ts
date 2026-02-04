export type ProductType = {
    id: string;
    categoryId: string | null;
    name: string;
    stock: number;
    minStock: number;
    unitType: string | null;
    costPrice: number;
    isForSale: boolean;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export type PublicProduct = {
    id: string;
    categoryId: string | null;
    name: string;
    stock: number;
    minStock: number;
    unitType: string | null;
    costPrice: number;
    isForSale: boolean;
    status: boolean;
};

export type ProductFiltersForService = {
    search?: string;
    categoryId?: string;
    isForSale?: boolean;
    status?: boolean;
    page: number;
    limit: number;
};

export type ProductFiltersForRepository = {
    search?: string;
    categoryId?: string;
    isForSale?: boolean;
    status?: boolean;
    limit: number;
    offset: number;
};

export type ProductFiltersForCount = {
    search?: string;
    categoryId?: string;
    isForSale?: boolean;
    status?: boolean;
};

export type ListOfProducts = {
    data: PublicProduct[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
};
