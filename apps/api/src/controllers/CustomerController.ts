import { Request, Response, NextFunction } from 'express';
import ICustomerService from '../interfaces/IServices/ICustomerService';
import { CustomerToCreateType, CustomerToUpdateType, CustomerFiltersType } from '../schemas/Customer.schema';

export default class CustomerController {
    constructor(private customerService: ICustomerService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerData: CustomerToCreateType = req.body;
            const newCustomer = await this.customerService.create(customerData);
            res.status(201).json({
                message: 'Customer created successfully',
                customer: newCustomer,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Customer ID is required' });
                return;
            }
            const customerData: CustomerToUpdateType = req.body;
            const updatedCustomer = await this.customerService.update(id, customerData);
            res.status(200).json({
                message: 'Customer updated successfully',
                customer: updatedCustomer,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Customer ID is required' });
                return;
            }
            await this.customerService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Customer ID is required' });
                return;
            }
            const customer = await this.customerService.getById(id);
            res.status(200).json({
                message: 'Customer retrieved successfully',
                customer,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters: CustomerFiltersType = res.locals.validatedQuery;
            const customers = await this.customerService.getAll(filters);
            res.status(200).json(customers);
        } catch (error) {
            next(error);
        }
    };
}
