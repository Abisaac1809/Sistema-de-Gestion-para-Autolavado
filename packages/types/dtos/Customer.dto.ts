export interface PublicCustomer {
    id: string;
    fullName: string;
    idNumber: string | null;
    phone: string | null;
}

export type CustomerFiltersForRepository = {
    search?: string;
    idNumber?: string;
    limit: number;
    offset: number;
};

export type CustomerFiltersForCount = {
    search?: string;
    idNumber?: string;
};

export type ListOfCustomers = {
    data: PublicCustomer[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
};
