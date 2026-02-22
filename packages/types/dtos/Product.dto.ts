import { UnitType } from '../enums.js';
import type { ProductFiltersType } from '../schemas/Product.schema.js';

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

export type StockUpdate = { id: string; newStock: number };

export type ProductFiltersForService = ProductFiltersType;

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
