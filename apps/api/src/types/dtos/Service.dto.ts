export type PublicService = {
    id: string;
    name: string;
    description: string | null;
    price: number;

    status: boolean;
    createdAt: Date;
    updatedAt: Date;
};


export type ServiceFiltersForService = {
    search?: string;
    status?: boolean;
    page: number;
    limit: number;
};

export type ServiceFiltersForRepository = {
    search?: string;
    status?: boolean;
    limit: number;
    offset: number;
};

export type ServiceFiltersForCount = {
    search?: string;
    status?: boolean;
};

export type ListOfServices = {
    data: PublicService[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
};
