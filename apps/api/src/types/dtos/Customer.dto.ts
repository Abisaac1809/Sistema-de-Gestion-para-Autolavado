export type {
    CustomerToCreateType,
    CustomerToUpdateType,
    CustomerFiltersType,
    PublicCustomer,
    CustomerFiltersForRepository,
    CustomerFiltersForCount,
    ListOfCustomers,
} from '@car-wash/types';

// Internal type used by Customer entity — not in shared package
export type CustomerFiltersForService = {
    search?: string;
    idNumber?: string;
    page: number;
    limit: number;
};

export interface CustomerType {
    id: string;
    fullName: string;
    idNumber: string | null;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null | undefined;
}
