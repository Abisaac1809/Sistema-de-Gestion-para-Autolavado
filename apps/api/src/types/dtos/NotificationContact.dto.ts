import {
    NotificationContactToCreateType,
    NotificationContactToUpdateType,
    NotificationContactFiltersType
} from "../../schemas/NotificationContact.schema";

export type NotificationContactType = {
    id: string;
    fullName: string | null;
    email: string;
    receiveReports: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null | undefined;
}

export type PublicNotificationContact = {
    id: string;
    fullName: string | null;
    email: string;
    receiveReports: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type NotificationContactFiltersForService = NotificationContactFiltersType;
export type NotificationContactFiltersForRepository = {
    search?: string;
    isActive?: boolean;
    offset: number;
    limit: number;
}

export type NotificationContactFiltersForCount = {
    search?: string;
    isActive?: boolean;
}

export type ListOfNotificationContacts = {
    data: PublicNotificationContact[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
}

export type {
    NotificationContactToCreateType,
    NotificationContactToUpdateType,
    NotificationContactFiltersType
};
