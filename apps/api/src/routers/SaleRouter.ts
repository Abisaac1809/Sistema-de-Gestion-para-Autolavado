import { Router } from 'express';
import SaleController from '../controllers/SaleController';
import ISaleService from '../interfaces/IServices/ISaleService';
import IPaymentService from '../interfaces/IServices/IPaymentService';
import validateSchema from '../middlewares/ValidateSchema';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import { SaleToCreate, SaleStatusChange, SaleFilters } from '../schemas/Sale.schema';
import { createSalePaymentsRouter } from './PaymentRouter';

export default function createSaleRouter(saleService: ISaleService, paymentService: IPaymentService): Router {
    const router = Router();
    const controller = new SaleController(saleService);

    router.post('/', validateSchema(SaleToCreate), controller.createQuickSale);
    router.get('/', validateQueryParams(SaleFilters), controller.getAll);
    router.get('/:id', controller.getById);
    router.patch('/:id/status', validateSchema(SaleStatusChange), controller.updateStatus);

    // Payment routes - nested under sales
    router.use('/:id/payments', createSalePaymentsRouter(paymentService));

    return router;
}
