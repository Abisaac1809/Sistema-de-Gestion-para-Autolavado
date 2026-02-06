import NotificationContact from '../../entities/NotificationContact';
import { 
    NotificationContactToCreateType,
    NotificationContactToUpdateType,
    NotificationContactFiltersForRepository,
    NotificationContactFiltersForCount 
} from '../../types/dtos/NotificationContact.dto';

export default interface INotificationContactRepository {
    create(data: NotificationContactToCreateType): Promise<NotificationContact>;
    getById(id: string): Promise<NotificationContact | null>;
    getAll(filters: NotificationContactFiltersForRepository): Promise<NotificationContact[]>;
    update(id: string, data: NotificationContactToUpdateType): Promise<NotificationContact>;
    softDelete(id: string): Promise<void>;
    restore(id: string): Promise<NotificationContact>;
    getByEmail(email: string): Promise<NotificationContact | null>;
    getBulkByIds(ids: string[]): Promise<NotificationContact[]>;
    count(filters: NotificationContactFiltersForCount): Promise<number>;
}
