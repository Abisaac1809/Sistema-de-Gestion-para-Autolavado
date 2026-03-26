import { Router } from 'express';
import PurchaseController from '../controllers/PurchaseController';
import validateSchema from '../middlewares/ValidateSchema';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import { PurchaseToCreate, PurchaseFilters } from '@car-wash/types';
import IPurchaseService from '../interfaces/IServices/IPurchaseService';

export default function createPurchaseRouter(service: IPurchaseService): Router {
    const router = Router();
    const controller = new PurchaseController(service);

    router.post('/', validateSchema(PurchaseToCreate), controller.create);

    router.get('/', validateQueryParams(PurchaseFilters), controller.getMany);

    router.get('/:id', controller.getById);

    router.delete('/:id', controller.softDelete);

    return router;
}
