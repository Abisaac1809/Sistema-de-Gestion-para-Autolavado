import NotificationContact from '../entities/NotificationContact';
import { PublicNotificationContact } from '../types/dtos/NotificationContact.dto';

export default class NotificationContactMapper {
    static toPublic(notificationContact: NotificationContact): PublicNotificationContact {
        return {
            id: notificationContact.id,
            fullName: notificationContact.fullName,
            email: notificationContact.email,
            receiveReports: notificationContact.receiveReports,
            isActive: notificationContact.isActive,
            createdAt: notificationContact.createdAt,
            updatedAt: notificationContact.updatedAt,
        };
    }

    static toPublicList(notificationContacts: NotificationContact[]): PublicNotificationContact[] {
        return notificationContacts.map(NotificationContactMapper.toPublic);
    }
}
