import { Router } from 'express';
import CustomerController from '../controllers/CustomerController';
import validateSchema from '../middlewares/ValidateSchema';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import {
    CustomerToCreate,
    CustomerToUpdate,
    CustomerFilters,
} from '../schemas/Customer.schema';
import ICustomerService from '../interfaces/IServices/ICustomerService';

export default function createCustomerRouter(customerService: ICustomerService): Router {
    const router = Router();
    const controller = new CustomerController(customerService);

    router.post('/', validateSchema(CustomerToCreate), controller.create);

    router.get('/', validateQueryParams(CustomerFilters), controller.list);

    router.get('/:id', controller.get);

    router.put('/:id', validateSchema(CustomerToUpdate), controller.update);

    router.delete('/:id', controller.delete);

    return router;
}
