import INotificationContactService from '../interfaces/IServices/INotificationContactService';
import INotificationContactRepository from '../interfaces/IRepositories/INotificationContactRepository';
import {
    NotificationContactToCreateType,
    NotificationContactToUpdateType,
    NotificationContactFiltersForService,
    ListOfNotificationContacts,
    PublicNotificationContact,
} from '../types/dtos/NotificationContact.dto';
import {
    NotificationContactAlreadyExistsError,
    NotificationContactNotFoundError,
} from '../errors/BusinessErrors';
import NotificationContactMapper from '../mappers/NotificationContactMapper';

export default class NotificationContactService implements INotificationContactService {
    constructor(private notificationContactRepository: INotificationContactRepository) { }

    async create(data: NotificationContactToCreateType): Promise<PublicNotificationContact> {
        const existing = await this.notificationContactRepository.getByEmail(data.email);

        if (existing) {
            if (existing.deletedAt !== null) {
                await this.notificationContactRepository.restore(existing.id);
                const updated = await this.notificationContactRepository.update(existing.id, data);
                return NotificationContactMapper.toPublic(updated);
            }
            
            throw new NotificationContactAlreadyExistsError(
                `Notification contact with email "${data.email}" already exists`
            );
        }

        const newNotificationContact = await this.notificationContactRepository.create(data);

        return NotificationContactMapper.toPublic(newNotificationContact);
    }

    async getById(id: string): Promise<PublicNotificationContact> {
        const notificationContact = await this.notificationContactRepository.getById(id);

        if (!notificationContact) {
            throw new NotificationContactNotFoundError(`Notification contact with ID ${id} not found`);
        }

        return NotificationContactMapper.toPublic(notificationContact);
    }

    async getAll(filters: NotificationContactFiltersForService): Promise<ListOfNotificationContacts> {
        const offset = (filters.page - 1) * filters.limit;

        const [notificationContacts, totalRecords] = await Promise.all([
            this.notificationContactRepository.getAll({
                search: filters.search,
                isActive: filters.isActive,
                limit: filters.limit,
                offset,
            }),
            this.notificationContactRepository.count({
                search: filters.search,
                isActive: filters.isActive,
            }),
        ]);

        const totalPages = Math.ceil(totalRecords / filters.limit);

        return {
            data: NotificationContactMapper.toPublicList(notificationContacts),
            meta: {
                totalRecords,
                currentPage: filters.page,
                limit: filters.limit,
                totalPages,
            },
        };
    }

    async update(id: string, data: NotificationContactToUpdateType): Promise<PublicNotificationContact> {
        const notificationContact = await this.notificationContactRepository.getById(id);
        if (!notificationContact) {
            throw new NotificationContactNotFoundError(`Notification contact with ID ${id} not found`);
        }

        if (data.email && data.email !== notificationContact.email) {
            const existing = await this.notificationContactRepository.getByEmail(data.email);
            if (existing && existing.id !== id) {
                throw new NotificationContactAlreadyExistsError(
                    `Notification contact with email "${data.email}" already exists`
                );
            }
        }

        const updated = await this.notificationContactRepository.update(id, data);
        return NotificationContactMapper.toPublic(updated);
    }

    async delete(id: string): Promise<void> {
        const existing = await this.notificationContactRepository.getById(id);
        if (!existing) {
            throw new NotificationContactNotFoundError(`Notification contact with ID ${id} not found`);
        }

        await this.notificationContactRepository.softDelete(id);
    }
}
