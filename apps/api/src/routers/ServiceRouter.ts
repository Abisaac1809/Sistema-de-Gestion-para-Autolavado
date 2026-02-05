import { Router } from 'express';
import ServiceController from '../controllers/ServiceController';
import IServiceService from '../interfaces/IServices/IServiceService';
import validateSchema from '../middlewares/ValidateSchema';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import { ServiceToCreate, ServiceToUpdate, ServiceFilters } from '../schemas/Service.schema';

export default function createServiceRouter(serviceService: IServiceService): Router {
    const router = Router();
    const controller = new ServiceController(serviceService);

    router.post('/', validateSchema(ServiceToCreate), controller.create);
    router.get('/', validateQueryParams(ServiceFilters), controller.list);
    router.get('/:id', controller.get);
    router.put('/:id', validateSchema(ServiceToUpdate), controller.update);
    router.delete('/:id', controller.delete);

    return router;
}
