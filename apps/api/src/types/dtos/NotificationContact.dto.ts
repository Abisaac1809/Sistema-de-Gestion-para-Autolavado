export type {
    NotificationContactToCreateType,
    NotificationContactToUpdateType,
    NotificationContactFiltersType,
    PublicNotificationContact,
    NotificationContactFiltersForService,
    NotificationContactFiltersForRepository,
    NotificationContactFiltersForCount,
    ListOfNotificationContacts,
} from '@car-wash/types';

// Internal type used by NotificationContact entity — not in shared package
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
