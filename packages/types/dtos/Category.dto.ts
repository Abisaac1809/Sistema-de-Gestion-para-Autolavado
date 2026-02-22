import { CategoryFiltersType } from '../schemas/Category.schema.js';

export type CategoryType = {
    id: string;
    name: string;
    description?: string | null;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export type PublicCategory = {
    id: string;
    name: string;
    description: string | null;
    status: boolean;
};

export type CategoryFiltersForService = CategoryFiltersType;

export type CategoryFiltersForRepository = {
    search?: string;
    status?: boolean;
    limit: number;
    offset: number;
};

export type CategoryFiltersForCount = {
    search?: string;
    status?: boolean;
};

export type ListOfCategories = {
    data: PublicCategory[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
};
