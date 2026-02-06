import {
    NotificationContactToCreateType,
    NotificationContactToUpdateType,
    NotificationContactFiltersForService,
    ListOfNotificationContacts,
    PublicNotificationContact,
} from '../../types/dtos/NotificationContact.dto';

export default interface INotificationContactService {
    create(data: NotificationContactToCreateType): Promise<PublicNotificationContact>;
    getById(id: string): Promise<PublicNotificationContact>;
    getAll(filters: NotificationContactFiltersForService): Promise<ListOfNotificationContacts>;
    update(id: string, data: NotificationContactToUpdateType): Promise<PublicNotificationContact>;
    delete(id: string): Promise<void>;
}
