import { Router } from 'express';
import StoreInfoController from '../controllers/StoreInfoController';
import validateSchema from '../middlewares/ValidateSchema';
import { StoreInfoToUpdate } from '../schemas/StoreInfo.schema';
import IStoreInfoService from '../interfaces/IServices/IStoreInfoService';

export default function createStoreInfoRouter(storeInfoService: IStoreInfoService): Router {
    const router = Router();
    const controller = new StoreInfoController(storeInfoService);

    router.get('/', controller.get);
    router.patch('/', validateSchema(StoreInfoToUpdate), controller.update);

    return router;
}
