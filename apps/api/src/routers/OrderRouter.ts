import { Router } from 'express';
import OrderController from '../controllers/OrderController';
import IOrderService from '../interfaces/IServices/IOrderService';
import ISaleService from '../interfaces/IServices/ISaleService';
import validateSchema from '../middlewares/ValidateSchema';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import { OrderToCreate, OrderToUpdate, OrderStatusChange, OrderPaymentStatusChange, OrderFilters } from '../schemas/Order.schema';
import { OrderDetailToCreate } from '../schemas/OrderDetail.schema';

export default function createOrderRouter(orderService: IOrderService, saleService: ISaleService): Router {
    const router = Router();
    const controller = new OrderController(orderService, saleService);

    router.post('/', validateSchema(OrderToCreate), controller.create);
    router.get('/', validateQueryParams(OrderFilters), controller.list);
    router.get('/:id', controller.get);
    router.patch('/:id', validateSchema(OrderToUpdate), controller.update);
    router.delete('/:id', controller.delete);

    router.patch('/:id/status', validateSchema(OrderStatusChange), controller.changeStatus);
    router.patch('/:id/payment-status', validateSchema(OrderPaymentStatusChange), controller.updatePaymentStatus);

    router.post('/:id/details', validateSchema(OrderDetailToCreate), controller.addDetail);
    router.delete('/:id/details/:detailId', controller.removeDetail);

    return router;
}
