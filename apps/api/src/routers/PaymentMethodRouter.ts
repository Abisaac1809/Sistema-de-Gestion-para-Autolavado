import { Router } from 'express';
import PaymentMethodController from '../controllers/PaymentMethodController';
import IPaymentMethodService from '../interfaces/IServices/IPaymentMethodService';
import validateSchema from '../middlewares/ValidateSchema';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import { PaymentMethodToCreate, PaymentMethodToUpdate, PaymentMethodFilters } from '../schemas/PaymentMethod.schema';

export default function createPaymentMethodRouter(paymentMethodService: IPaymentMethodService): Router {
    const router = Router();
    const controller = new PaymentMethodController(paymentMethodService);

    router.post('/', validateSchema(PaymentMethodToCreate), controller.create);
    router.get('/', validateQueryParams(PaymentMethodFilters), controller.list);
    router.get('/:id', controller.get);
    router.put('/:id', validateSchema(PaymentMethodToUpdate), controller.update);
    router.delete('/:id', controller.delete);

    return router;
}
