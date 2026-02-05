import { UnitType } from '../enums';

export type ProductType = {
    id: string;
    categoryId: string | null;
    name: string;
    stock: number;
    minStock: number;
    unitType: UnitType | null;
    costPrice: number;
    isForSale: boolean;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export type RawProduct = {
    id: string;
    category_id: string | null;
    name: string;
    stock: string | number;
    min_stock: string | number;
    unit_type: string | null;
    cost_price: string | number;
    is_for_sale: boolean;
    status: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
};


export type PublicProduct = {
    id: string;
    categoryId: string | null;
    name: string;
    stock: number;
    minStock: number;
    unitType: UnitType | null;
    costPrice: number;
    isForSale: boolean;
    status: boolean;
};

export type ProductFiltersForService = {
    search?: string;
    categoryId?: string;
    isForSale?: boolean;
    status?: boolean;
    lowStock?: boolean;
    page: number;
    limit: number;
};

export type ProductFiltersForRepository = {
    search?: string;
    categoryId?: string;
    isForSale?: boolean;
    status?: boolean;
    lowStock?: boolean;
    limit: number;
    offset: number;
};

export type ProductFiltersForCount = {
    search?: string;
    categoryId?: string;
    isForSale?: boolean;
    status?: boolean;
    lowStock?: boolean;
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
