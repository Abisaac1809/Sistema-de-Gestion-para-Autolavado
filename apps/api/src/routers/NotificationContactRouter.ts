import { Router } from 'express';
import NotificationContactController from '../controllers/NotificationContactController';
import INotificationContactService from '../interfaces/IServices/INotificationContactService';
import validateSchema from '../middlewares/ValidateSchema';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import { NotificationContactToCreate, NotificationContactToUpdate, NotificationContactFilters } from '../schemas/NotificationContact.schema';

export default function createNotificationContactRouter(notificationContactService: INotificationContactService): Router {
    const router = Router();
    const controller = new NotificationContactController(notificationContactService);

    router.post('/', validateSchema(NotificationContactToCreate), controller.create);
    router.get('/', validateQueryParams(NotificationContactFilters), controller.list);
    router.get('/:id', controller.get);
    router.put('/:id', validateSchema(NotificationContactToUpdate), controller.update);
    router.delete('/:id', controller.delete);

    return router;
}
