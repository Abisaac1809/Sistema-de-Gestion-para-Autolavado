import { UnitType } from '@car-wash/types';

export type {
    ProductToCreateType,
    ProductToUpdateType,
    ProductFiltersType,
    RawProduct,
    PublicProduct,
    StockUpdate,
    ProductFiltersForService,
    ProductFiltersForRepository,
    ProductFiltersForCount,
    ListOfProducts,
} from '@car-wash/types';

// Internal type used by Product entity — not in shared package
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
