import { Request, Response, NextFunction } from 'express';
import INotificationContactService from '../interfaces/IServices/INotificationContactService';
import { NotificationContactToCreateType, NotificationContactToUpdateType, NotificationContactFiltersForService } from '../types/dtos/NotificationContact.dto';

export default class NotificationContactController {
    constructor(private notificationContactService: INotificationContactService) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notificationContactData: NotificationContactToCreateType = req.body;
            const newNotificationContact = await this.notificationContactService.create(notificationContactData);
            res.status(201).json({
                message: 'Notification contact created successfully',
                notificationContact: newNotificationContact,
            });
        } catch (error) {
            next(error);
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Notification contact ID is required' });
                return;
            }
            const notificationContact = await this.notificationContactService.getById(id);
            res.status(200).json({
                message: 'Notification contact retrieved successfully',
                notificationContact,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters: NotificationContactFiltersForService = res.locals.validatedQuery;
            const result = await this.notificationContactService.getAll(filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Notification contact ID is required' });
                return;
            }
            const notificationContactData: NotificationContactToUpdateType = req.body;
            const updatedNotificationContact = await this.notificationContactService.update(id, notificationContactData);
            res.status(200).json({
                message: 'Notification contact updated successfully',
                notificationContact: updatedNotificationContact,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Notification contact ID is required' });
                return;
            }
            await this.notificationContactService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
