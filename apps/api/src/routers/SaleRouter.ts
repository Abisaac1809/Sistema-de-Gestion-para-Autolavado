import { Router } from 'express';
import SaleController from '../controllers/SaleController';
import ISaleService from '../interfaces/IServices/ISaleService';
import IPaymentService from '../interfaces/IServices/IPaymentService';
import validateSchema from '../middlewares/ValidateSchema';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import { SaleToCreate, SaleStatusChange, SaleFilters } from '../schemas/Sale.schema';
import createSalePaymentRouter from './SalePaymentRouter';

export default function createSaleRouter(saleService: ISaleService, paymentService: IPaymentService): Router {
    const router = Router();
    const controller = new SaleController(saleService);

    router.post('/', validateSchema(SaleToCreate), controller.createQuickSale);
    router.get('/', validateQueryParams(SaleFilters), controller.list);
    router.get('/:id', controller.get);
    router.patch('/:id/status', validateSchema(SaleStatusChange), controller.updateStatus);

    // Payment routes - nested under sales
    router.use('/:id/payments', createSalePaymentRouter(paymentService));

    return router;
}
