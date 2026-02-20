import { Router } from 'express';
import InventoryAdjustmentController from '../controllers/InventoryAdjustmentController';
import IInventoryAdjustmentService from '../interfaces/IServices/IInventoryAdjustmentService';
import validateSchema from '../middlewares/ValidateSchema';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import { InventoryAdjustmentToCreate, InventoryAdjustmentFilters } from '../schemas/InventoryAdjustment.schema';

export default function createInventoryAdjustmentRouter(inventoryAdjustmentService: IInventoryAdjustmentService): Router {
    const router = Router();
    const controller = new InventoryAdjustmentController(inventoryAdjustmentService);

    router.post('/', validateSchema(InventoryAdjustmentToCreate), controller.create);
    router.get('/', validateQueryParams(InventoryAdjustmentFilters), controller.list);
    router.get('/:id', controller.get);

    return router;
}
